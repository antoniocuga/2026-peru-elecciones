import pandas as pd
from onpe import EG2021Spider

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
    data = list(col.find({'is_old':{"$exists":False}}).sort([('_id', pymongo.DESCENDING)]))
    seen_ubigeos = set()
    dfs = []
    for datum in data:
        if datum['cod_dist'] in seen_ubigeos:
            col.update_one({'_id':datum['_id']}, {'$set': {"is_old":True}})
            print("seen")
            continue

        ubigeo = datum['summary']["CCODI_UBIGEO"]
        general = datum['generals']['generalData']
        general.update(    datum['generals']['actData'] )
        general.update( dist_mapper[ubigeo] )
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