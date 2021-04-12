import scrapy
import requests
import pymongo
import environ
import json
import os
try:
    # Dev
    from datautils import scraping_utils, bd_utils
except:
    pass

import datetime

class EG2021Spider(scrapy.Spider):
    name = "eg2021"
    custom_settings = {
        'CONCURRENT_REQUESTS':16,
        'DOWNLOAD_DELAY': 0.5,
    }
    url = ""
    # NOTE: url a nivel de actas
    # https://www.resultados.eleccionesgenerales2021.pe/EG2021/Actas/Ubigeo/P/010000/010200/010202/0033/000179

    # NOTE: ya tienen actas procesadas
    # https://www.resultados.eleccionesgenerales2021.pe/EG2021/Actas/Ubigeo/P/140000/140100/140101/2674
    headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en,es-419;q=0.9,es;q=0.8',
        'Cache-Control': 'no-cache',
        'Origin': 'https://www.resultados.eleccionesgenerales2021.pe',
        'Pragma': 'no-cache',
        'Referer': 'https://www.resultados.eleccionesgenerales2021.pe/',
        'Sec-Ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
        'Sec-Ch-ua-mobile': '?0',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'
    }

    def __init__(self, mode:str):
        env = environ.Env()
        environ.Env.read_env()
        #  NOTE ; requiere un archivo .env en este mismo directorio
        self.mongo_cs = env('mongo_cs')
        curdir = os.path.dirname(os.path.abspath(__file__))
        with open(f"{curdir}/ubigeos.json") as F:
            self.ubigeos = json.load(F)
            # ['departments', 'provinces', 'districts']
            # {'CDGO_DEP': '230000', 'DESC_DEP': 'TUMBES', 'CDGO_PADRE': '000000'}
            # {'CDGO_PROV': '110600', 'DESC_PROV': 'YAULI', 'CDGO_PADRE': '110000'}
            # {'CDGO_DIST': '130106', 'DESC_DIST': 'MONSEFU', 'CDGO_PADRE': '130100'}
        self.configure_dbs()
        
        if mode == "resultados":
            self.start_requests = self.get_resultados
        if mode == "locales":
            self.start_requests = self.get_locales_votacion
        if mode == "mesas":
            self.start_requests = self.get_mesas
        if mode == "summary":
            self.start_requests = self.get_summary
    

    def closed(self, reason):
        self.client.close()


    def get_summary(self):
        for dist in self.ubigeos['districts']:
            cod_dist = dist['CDGO_DIST']
            # if self.col_summary.find_one({'cod_dist':cod_dist}) is  None:
            url = f"https://api.resultados.eleccionesgenerales2021.pe/results/10/{cod_dist}?name=param"
            yield scrapy.Request(url, headers = self.headers, callback=self.parse_summary, meta = {'meta':{'cod_dist':cod_dist}})    


    def parse_summary(self, response):
        cod_dist = response.meta['meta']['cod_dist']
        jason = json.loads(response.text)
        jason.update({
            'scraped_at':datetime.datetime.now(),
            'cod_dist': cod_dist,
        })
        self.col_summary.insert_one(jason)


    def get_resultados(self):
        # query = {'PROCESADO':3}
        query = {}
        for mesa in self.col_mesas.find(query):
            cod_mesa = mesa['NUMMESA']
            if self.col_data.find_one({'cod_mesa': cod_mesa}, projection={"_id":False, 'cod_mesa':True}) is None:
                url = f"https://api.resultados.eleccionesgenerales2021.pe/mesas/detalle/{cod_mesa}?name=param"
                yield scrapy.Request(url, headers = self.headers, callback = self.parse_resultado, meta = {'meta':{'cod_mesa':cod_mesa}})
    
    def parse_resultado(self,response):
        jason = json.loads(response.text)
        for key in ['generalPre', 'generalCon', 'generalPar']:
            for i in jason['procesos'][key]['votos']:
                if i['AUTORIDAD'] == "TOTAL VOTOS EMITIDOS":
                    if i['congresal'] == "0":
                        print("no tiene data ", key,  response.meta['meta'])
                        return None
            
        jason.update({
            'scraped_at': datetime.datetime.now(),
            'cod_mesa': response.meta['meta']['cod_mesa']
        })
        self.col_data.insert_one(jason)


        # url = "https://www.resultados.eleccionesgenerales2021.pe/EG2021/Actas/Ubigeo/P/140000/140100/140101/2674"
        # url = "https://api.resultados.eleccionesgenerales2021.pe/mesas/locales/140101?name=param"
        # r = requests.get(url, headers= headers)
        # for dep in range(1, 26):
        #     ubigeo_dep = str(dep).zfill(2) + "0000"
        #     for prov in 



    def get_locales_votacion(self):
        for dist in self.ubigeos['districts']:
            if self.col_locales.find_one({'CCODI_UBIGEO':dist['CDGO_DIST']}) is  None:
                url = f"https://api.resultados.eleccionesgenerales2021.pe/mesas/locales/{dist['CDGO_DIST']}?name=param"
                yield scrapy.Request(url, headers = self.headers, callback=self.parse_local)
    def parse_local(self, response):
        for i in json.loads(response.text)['locales']:
            self.col_locales.insert_one(i)
    

    def get_mesas(self):
        for local in self.col_locales.find():
            dist_ubi = local['CCODI_UBIGEO']
            cod_local = local['CCODI_LOCAL']
            meta = {'meta': dict(dist_ubi=dist_ubi,cod_local=cod_local)}

            if self.col_mesas.find_one(meta['meta']) is None:
                # dist_ubi= "140101"
                # cod_local="D188"
                url = f"https://api.resultados.eleccionesgenerales2021.pe/mesas/actas/11/{dist_ubi}/{cod_local}?name=param"
                # r = requests.get(url, headers=headers)
                yield scrapy.Request(url, headers=self.headers, callback=self.parse_mesa, meta = meta)        
    def parse_mesa(self, response):
        meta = response.meta['meta']
        for i in json.loads(response.text)['mesasVotacion']:
            i.update(meta)
            self.col_mesas.insert_one(i)


    def configure_dbs(self):
        self.client = pymongo.MongoClient(self.mongo_cs)
        self.bd = self.client['eg2021']
        self.col_locales = self.bd['locales']

        bd_utils.create_index('scraping_idx', ['CCODI_LOCAL'], self.col_locales)
        bd_utils.create_index('scraping_idx2', ['CCODI_UBIGEO'], self.col_locales)

        self.col_mesas = self.bd['mesas']
        bd_utils.create_index('scraping_idx', ['dist_ubi', 'cod_local'], self.col_mesas)
        
        self.col_summary = self.bd['summary']
        bd_utils.create_index('scraping_idx2', ['cod_dist'], self.col_summary)
        bd_utils.create_index('processing_indexx', ['scraped_at', 'is_old'], self.col_summary)

        self.col_data = self.bd['resultados']
        bd_utils.create_index('scraping_idx2', ['cod_mesa'], self.col_data)



def parse():
    import pandas as pd
    from onpe import EG2021Spider
    spider = EG2021Spider("xx")
    col = spider.col_data

    totales = []
    data = list()
    for datum in col.find():
    # datum = data[1]    
        presidencial = datum['procesos']['generalPre']
        meta = presidencial['presidencial']
        for i in presidencial['votos']:
            i.update(meta)
            i['mongo_id'] = datum['_id']
        votos = pd.DataFrame(presidencial['votos'])
        totales.append(votos)
    
    final = pd.concat(totales, ignore_index=True)

    final.to_csv("muestra.csv", index=False)
