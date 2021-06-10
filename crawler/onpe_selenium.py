import selenium
"""
# NOTE: dependiendo de la version de Chrome que tengas
wget -N https://chromedriver.storage.googleapis.com/91.0.4472.19/chromedriver_linux64.zip -P ~/
unzip ~/chromedriver_linux64.zip -d ~/
rm ~/chromedriver_linux64.zip
sudo mv -f ~/chromedriver /usr/local/share/
sudo chmod +x /usr/local/share/chromedriver
sudo ln -s /usr/local/share/chromedriver /usr/local/bin/chromedriver
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains 
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from datautils.scraping_utils import inspect_error


import pymongo
from datautils import bd_utils
from typing import Dict, List, Tuple, Optional
import environ

import scrapy
import code
import json
import time
import random

import traceback
import datetime
import os

import onpe

class SeleniumOnpe():
    base_url = "https://www.resultadossep.eleccionesgenerales2021.pe/SEP2021/ResumenElecciones"
    BASE_SLUG = "resultadossep"

    def __init__(self, complete_districts=True):
        self.complete_districts = complete_districts
        self.env = environ.Env(pwd=(str,''), user_data_dir=(str,''))
        environ.Env.read_env()
        #  NOTE ; requiere un archivo .env en este mismo directorio
        self.mongo_cs = self.env('mongo_cs')
        self.mongo_cs
        self.use_proxies = False
        self.driver = None
        self.configure_dbs()
        # curdir = os.path.dirname(os.path.abspath(__file__))
        curdir="/home/grossir/Desktop/Trabajos/OjoPublico/elecciones2021/crawler"
        with open(f"{curdir}/ubigeos.json") as F:
            self.ubigeos = json.load(F)
        self.setup_selenium()
        self.scrape()



    def setup_selenium(self):
        options = selenium.webdriver.ChromeOptions()
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option("prefs", { 
            "profile.default_content_setting_values.notifications": 2
        })
        # options.add_argument("--disable-dev-shm-usage")
        # options.add_argument("--headless")
        # options.add_argument("--no-sandbox")


        
        if self.use_proxies:
            # https://linuxize.com/post/how-to-install-and-configure-squid-proxy-on-ubuntu-18-04/#configuring-your-browser-to-use-proxy
            # NOTE:
            # usar esta configuracion de iptables
            # https://wiki.squid-cache.org/ConfigExamples/Intercept/LinuxDnat
            options.add_argument('lang=es')
            # options.add_argument(f'proxy-server={self.proxy_ip}:{self.proxy_port}')
            print("Aqui")
            options.add_argument("user-data-dir=/home/grossir/.credentials/another")
        else:
            # NOTE: evitar estar logueandose cada vez que crashee
            # https://stackoverflow.com/questions/15058462/how-to-save-and-load-cookies-using-python-selenium-webdriver
            pass
            # options.add_argument(self.env('user_data_dir'))


        if self.driver is None:
            self.driver = selenium.webdriver.Chrome(options = options)
            self.driver.get(self.base_url)

    def scrape(self):
        try:
            self.get_general_counts()
            self.get_districts()
        except:
            pass
        finally:
            self.driver.close()
            self.driver.quit()

    def get_districts(self):
        self.urls = self.get_summary()
        start_time = time.time()
        for index, i in enumerate(self.urls):
            try:
                self.driver.get(i['url'])
                jason = json.loads( self.driver.find_element_by_xpath("//pre").text )
                jason.update({
                    'scraped_at':datetime.datetime.now(),
                    'cod_dist': i['cod_dist'],
                })
                self.col_summary.insert_one(jason)
            except:
                import traceback
                print(traceback.format_exc())
            finally:
                print((time.time() - start_time)/ 60, "minutos")



    def get_summary(self):
        if self.complete_districts:
            districts = [{'CDGO_DIST': '900000'}] + self.ubigeos['districts'] 
        else:
            districts = self.get_district_codes() + [{'CDGO_DIST': '900000'}]

        random.shuffle(districts)
        urls = []
        for dist in districts:
            cod_dist = dist['CDGO_DIST']
            # if self.col_summary.find_one({'cod_dist':cod_dist}) is  None:
            url = f"https://api.{self.BASE_SLUG}.eleccionesgenerales2021.pe/results/10/{cod_dist}?name=param"
            urls.append({
                'url': url, 'cod_dist': cod_dist
            })
        return urls








    def configure_dbs(self):
        self.client = pymongo.MongoClient(self.mongo_cs)
        self.bd = self.client['eg2021']
        self.col_locales = self.bd['locales']
        self.col_mesas = self.bd['mesas']        
        self.col_congreso = self.bd['congreso']
        self.col_congreso_names = self.bd['congresonames']

        # self.col_summary = self.bd['summary']
        self.col_summary = self.bd['summary_sep']
        self.col_data = self.bd['resultados']

        try:
            # NOTE: adaptacion para poder correrlo sin esta dependencia
            bd_utils.create_index('scraping_idx', ['CCODI_LOCAL'], self.col_locales)
            bd_utils.create_index('scraping_idx2', ['CCODI_UBIGEO'], self.col_locales)
            bd_utils.create_index('scraping_idx', ['dist_ubi', 'cod_local'], self.col_mesas)
            bd_utils.create_index('scraping_idx2', ['cod_dist'], self.col_summary)
            bd_utils.create_index('processing_indexx', ['scraped_at', 'is_old'], self.col_summary)
            bd_utils.create_index('scraping_idx2', ['is_old'], self.col_congreso)        
            bd_utils.create_index('scraping_idx2', ['cod_mesa'], self.col_data)
        except:
            pass
    def get_district_codes(self):
        try:
            bd_utils.create_index('opt_index', ['generals.generalData.POR_ACTAS_PROCESADAS'], self.col_data)
        except:
            pass
        cursor = self.col_summary.aggregate([
            {
                "$match":{
                    # "is_old":{"$exists":False},
                    "generals.generalData.POR_ACTAS_PROCESADAS": {"$ne":"100.000"}
                }
            },
            {
                "$group": {
                    "_id": "$cod_dist",
                    "last_ts": { "$last": "$scraped_at" }
                }
            },
            {"$sort": { "last_ts":1}},
        ])
        # devolviendo district codes
        dists =  [{'CDGO_DIST': i['_id']} for i in cursor]
        return dists

    def get_general_counts(self):
        general_counts = [
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/250000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/240000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/230000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/220000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/210000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/200000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/190000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/180000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/170000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/160000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/150000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/140000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/130000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/120000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/110000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/100000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/090000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/080000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/070000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/060000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/050000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/040000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/030000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/020000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/010000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/900000?name=param',
            'https://api.resultadossep.eleccionesgenerales2021.pe/results/10/000000?name=param'
        ]
        import re
        REGEX = re.compile('[0-9]{6}')
        for i in general_counts:
            try:
                cod = re.findall(REGEX, i)[0]
                self.driver.get(i)
                jason = json.loads( self.driver.find_element_by_xpath("//pre").text )
                with open(cod + '.json', 'w') as F:
                    json.dump(jason, F)
                    

            except:
                import traceback
                print(traceback.format_exc())

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description= 'XX')

    parser.add_argument('complete_districts',
                        type = str, 
                        nargs="?",
                        choices = ['True', 'False'],
                        default = 'False')

    parser.add_argument('loop_time',
                        type = int,
                        nargs = "?", 
                        default = 10)
    args = parser.parse_args()
    complete_districts = args.complete_districts == "True"
    while True:
        if complete_districts:
            x = SeleniumOnpe(True)
        else:
            # NOTE: no pude conectar el crontab, error pegado abajo, revisar
            x = SeleniumOnpe(False)
            print("sleeping")
            time.sleep(60 * args.loop_time)
            print("Restarting")
"""
Traceback (most recent call last):
  File "/home/grossir/Desktop/Trabajos/OjoPublico/elecciones2021/crawler/onpe_selenium.py", line 239, in <module>
    x = SeleniumOnpe(False)
  File "/home/grossir/Desktop/Trabajos/OjoPublico/elecciones2021/crawler/onpe_selenium.py", line 55, in __init__
    self.setup_selenium()
  File "/home/grossir/Desktop/Trabajos/OjoPublico/elecciones2021/crawler/onpe_selenium.py", line 86, in setup_selenium
    self.driver = selenium.webdriver.Chrome(options = options)
  File "/home/grossir/venvs/py37/lib/python3.7/site-packages/selenium/webdriver/chrome/webdriver.py", line 81, in __init__
    desired_capabilities=desired_capabilities)
  File "/home/grossir/venvs/py37/lib/python3.7/site-packages/selenium/webdriver/remote/webdriver.py", line 157, in __init__
    self.start_session(capabilities, browser_profile)
  File "/home/grossir/venvs/py37/lib/python3.7/site-packages/selenium/webdriver/remote/webdriver.py", line 252, in start_session
    response = self.execute(Command.NEW_SESSION, parameters)
  File "/home/grossir/venvs/py37/lib/python3.7/site-packages/selenium/webdriver/remote/webdriver.py", line 321, in execute
    self.error_handler.check_response(response)
  File "/home/grossir/venvs/py37/lib/python3.7/site-packages/selenium/webdriver/remote/errorhandler.py", line 242, in check_response
    raise exception_class(message, screen, stacktrace)
selenium.common.exceptions.WebDriverException: Message: unknown error: Chrome failed to start: exited abnormally.
  (unknown error: DevToolsActivePort file doesn't exist)
  (The process started from chrome location /usr/bin/google-chrome is no longer running, so ChromeDriver is assuming that Chrome has crashed.)

"""