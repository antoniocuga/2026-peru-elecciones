import pandas as pd
from onpe import EG2021Spider
import pymongo

# NOTE: para acelerar filtrado de data acumulada
def flag_as_old_everything_but_last():
    col = spider.col_summary
    RES = list(col.aggregate([
        {"$match":{"is_old":{"$exists":False}}},
        {"$sort": { "_id":-1 } },
        {
            "$group":{
                "_id": "$cod_dist",
                "last_id": { "$last": "$_id" }
            }
        },
    ]))
    ids = [i['last_id'] for i in RES]
    col.update_many({"_id": {"$nin":ids}}, {"$set": {"is_old":True}})

def parse_candidate_names():
    spider = EG2021Spider("xx")
    col = spider.col_congreso_names

    dics = []
    for i in col.find():
        for j in i['results']:
            j.update({
                'departamento': i['dep'],
                'partido': i['partido'],
            })
            dics.append(j)
    df = pd.DataFrame(dics)
    df.to_csv('candidates_names.csv', index=False)


def parse_congreso():
    spider = EG2021Spider("xx")
    col = spider.col_congreso

    region_mapper = {'D44001': 'AMAZONAS',
    'D44002': 'ANCASH',
    'D44003': 'APURIMAC',
    'D44004': 'AREQUIPA',
    'D44005': 'AYACUCHO',
    'D44006': 'CAJAMARCA',
    'D44007': 'CALLAO',
    'D44008': 'CUSCO',
    'D44009': 'HUANCAVELICA',
    'D44010': 'HUANUCO',
    'D44011': 'ICA',
    'D44012': 'JUNIN',
    'D44013': 'LA LIBERTAD',
    'D44014': 'LAMBAYEQUE',
    'D44015': 'LIMA',
    'D44016': 'LIMA PROVINCIAS',
    'D44017': 'LORETO',
    'D44018': 'MADRE DE DIOS',
    'D44019': 'MOQUEGUA',
    'D44020': 'PASCO',
    'D44021': 'PIURA',
    'D44022': 'PUNO',
    'D44023': 'SAN MARTIN',
    'D44024': 'TACNA',
    'D44025': 'TUMBES',
    'D44026': 'UCAYALI',
    'D44027': 'RESIDENTES EN EL EXTRANJERO'}

    dfs = []
    seen = set()
    for datum in col.find({'is_old':{"$exists":False}}, no_cursor_timeout=True).sort([('_id', pymongo.DESCENDING)]).batch_size(10):
        # Out[8]: dict_keys(['_id', 'generals', 'results', 'summary', 'scraped_at', 'slug'])
        if datum['slug'] in seen:
            col.update_one({'_id':datum['_id']}, {"$set": {"is_old":True}})
            print('seen', end = "", flush=True)
            continue
        else:
            print("acc", end = "", flush=True)

        acc = datum['generals']['generalData']
        acc.update(datum['generals']['actData'])
        acc.update({'region': region_mapper['D440' + datum['slug']]})
        for i in datum['results']:
            i.update(acc)
        df = pd.DataFrame(datum['results'])
        dfs.append(df)

        seen.add(datum['slug'])
    # datum['summary']
    final = pd.concat(dfs, ignore_index = True)
    final.to_csv("congreso_sucio.csv", index=False)



def parse_summary():
    spider = EG2021Spider("xx")
    col = spider.col_summary

    # NOTE: tengo que quedarme con el mas actualizado
    # NOTE: tengo que pegarle el nombre completo de ubigeos
    ubigeos = spider.ubigeos
    # {'CDGO_DEP': '230000', 'DESC_DEP': 'TUMBES', 'CDGO_PADRE': '000000'}
    # {'CDGO_PROV': '110600', 'DESC_PROV': 'YAULI', 'CDGO_PADRE': '110000'}
    # {'CDGO_DIST': '130106', 'DESC_DIST': 'MONSEFU', 'CDGO_PADRE': '130100'}
    dist_mapper = {}
    for i in ubigeos['districts']:
        prov, dep = None, None
        
        for j in ubigeos['provinces']:
            if j['CDGO_PROV'] == i['CDGO_PADRE']:
                prov = j
                break
        for x in ubigeos['departments']:
            if x['CDGO_DEP'] == j['CDGO_PADRE']:
                dep = x
                break
        dist_mapper[i['CDGO_DIST']] = {
            'dep': dep['DESC_DEP'],
            'prov': prov['DESC_PROV'],
            'dist': i['DESC_DIST'],
            'ubigeo': i['CDGO_DIST']
        }

    # NOTE: aseguramos cojer solo el ultimo
    # check = datetime.datetime.now() - datetime.timedelta(hours=0.4)
    # {'scraped_at':{'$lte':check}, 'is_old':{"$exists":False}}
    seen_ubigeos = set()
    dfs = []
    for datum in col.find({'is_old':{"$exists":False}}, no_cursor_timeout=True).sort([('_id', pymongo.DESCENDING)]).batch_size(10):
        if datum['cod_dist'] in seen_ubigeos:
            col.update_one({'_id':datum['_id']}, {'$set': {"is_old":True}})
            print("seen", flush=True)
            continue
        else:
            print("acc", flush=True, end = " ")

        ubigeo = datum['summary']["CCODI_UBIGEO"]
        general = datum['generals']['generalData']
        general.update(    datum['generals']['actData'] )
        general.update( dist_mapper.get(ubigeo, {}) )
        general['tiempo_actualizacion'] = datum['scraped_at']

        for i in datum['results']:
            i.update(general)
        df = pd.DataFrame(datum['results'])
        dfs.append(df)
        seen_ubigeos.add(datum['cod_dist'])
    
    final = pd.concat(dfs, ignore_index=True)
    final.to_csv("muestra_resumen_distrito.csv", index=False)

def build_mapper():
    set(final.AGRUPACION)
    import json
    with open("/home/grossir/Desktop/Trabajos/OjoPublico/elecciones2021/public/data/resultados_total.json") as F:
        restotal = json.load(F)
    cucho = pd.DataFrame(restotal)[ ['candidato_id', 'candidato', 'color', 'partido', 'partido_id']].drop_duplicates().sort_values('candidato_id')
    onpe = final[[ 'NOMBREe_CANDIDATO', 'AGRUPACION' ] ].drop_duplicates().sort_values('NOMBREe_CANDIDATO')
    new_onpe = onpe.loc[ onpe.NOMBREe_CANDIDATO.apply(lambda x: not pd.isnull(x)) , :]
    df_c = pd.concat([new_onpe.reset_index(drop=True), cucho.reset_index(drop=True)], axis=1)
    df_c.to_csv('xx.csv')

    candidate_mapper = pd.read_csv("map_candidates_to_viz.csv")


if __name__ == "__main__":
    parse_summary()
    parse_congreso()