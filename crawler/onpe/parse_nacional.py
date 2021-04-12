import csv
import json
import random

resultados_total = []
departamentos = ['total','extranjero', 'lima','lima-provincias', 'callao', 'loreto', 'tumbes', 'piura', 'lambayeque', 'la-libertad', 'arequipa', 'moquegua', 'tacna', 'ica', 'ancash', 'amazonas', 'ayacucho', 'cusco', 'madre-de-dios', 'san-martin', 'ucayali', 'junin', 'puno', 'huanuco', 'pasco', 'cajamarca', 'huancavelica', 'apurimac']

partidos = {
	"total-de-votos-válidos": {
		"partido_id": "total-de-votos-válidos",
		"color": "#e3e3e3",
		"candidato_id": "",
		"candidato": ""
	},
	"partido-politico-nacional-peru-libre": {
		"partido": "Peru Libre",
    "partido_id": "peru-libre",
		"color": "#f40201",
		"candidato_id": "pedro-castillo",
    "candidato": "Pedro Castillo"
	},
	"avanza-pais---partido-de-integracion-social": {
    "partido": "Avanza Pa\u00eds",
    "partido_id": "avanza-pais",
		"color": "#ff2c79",
		"candidato_id": "hernando-de-soto",
    "candidato": "Hernando de Soto"
	},
	"renovacion-popular": {
    "partido": "Renovaci\u00f3n Popular",
    "partido_id": "renovacion-popular",
		"color": "#00aede",
		"candidato_id": "rafael-lopez-aliaga",
    "candidato": "Rafael L\u00f3pez Aliaga"
	},
	"fuerza-popular": {
		"candidato_id": "keiko-fujimori",
    "candidato": "Keiko Fujimori",
		"partido": "Fuerza Popular",
    "partido_id": "fuerza-popular",
		"color": "#fd6600"
	},
	"accion-popular": {
    "partido": "Acci\u00f3n Popular",
    "partido_id": "accion-popular",
		"color": "#000000",
		"candidato_id": "yonhi-lescano",
    "candidato": "Yonhy Lescano"
	},
	"juntos-por-el-peru": {
		"candidato_id": "veronika-mendoza",
    "candidato": "Ver\u00f3nika Mendoza",
		"partido": "Juntos por el Per\u00fa",
    "partido_id": "juntos-por-el-peru",
		"color": "#2fc100"
	},
	"victoria-nacional": {
    "partido": "Victoria Nacional",
    "partido_id": "victoria-nacional",
		"color": "#ff2607",
		"candidato_id": "george-forsyth",
    "candidato": "George Forsyth"
	},
	"alianza-para-el-progreso": {
    "partido": "Alianza para el Progreso",
    "partido_id": "alianza-para-el-progreso",
		"color": "#0050a0",
		"candidato_id": "cesar-acuna",
    "candidato": "C\u00e9sar Acu\u00f1a"
	},
	"podemos-peru": {
		"candidato_id": "daniel-urresti",
    "candidato": "Daniel Urresti",
		"partido": "Podemos Per\u00fa",
    "partido_id": "podemos-peru",
		"color": "#004da3"
	},
	"partido-morado": {
		"candidato_id": "julio-guzman",
    "candidato": "Julio Guzm\u00e1n",
		"partido": "Partido Morado",
    "partido_id": "partido-morado",
		"color": "#4f1b7f"
	},
	"partido-popular-cristiano---ppc": {
    "partido": "Partido Popular Cristiano",
    "partido_id": "partido-popular-cristiano",
		"color": "#009a21",
		"candidato_id": "alberto-beingolea",
    "candidato": "Alberto Beingolea"
	},
	"partido-democratico-somos-peru": {
    "partido": "Somos Per\u00fa",
    "partido_id": "somos-peru",
		"color": "#ff2600",
		"candidato_id": "daniel-salaverry",
    "candidato": "Daniel Salaverry"
	},
	"partido-nacionalista-peruano": {
    "partido": "Partido Nacionalista",
    "partido_id": "partido-nacionalista",
		"color": "#f52300",
		"candidato_id": "ollanta-humala",
    "candidato": "Ollanta Humala"
	},
	"union-por-el-peru": {
    "partido": "Union Por El Peru",
    "partido_id": "union-por-el-peru",
		"color": "#ff2600",
		"candidato_id": "jose-vega",
    "candidato": "Jos\u00e9 Vega Antonio"
	},
	"renacimiento-unido-nacional": {
		"partido": "Renacimiento Unido",
    "partido_id": "renacimiento-unido",
		"color": "#1022b9",
		"candidato_id": "ciro-galvez",
    "candidato": "Ciro Galvez"
	},
	"peru-patria-segura": {
    "partido": "Per\u00fa Patria Segura",
    "partido_id": "peru-patria-segura",
		"color": "#0055a2",
			"candidato_id": "rafael-santos",
    "candidato": "Rafael Santos"
	},
	"el-frente-amplio-por-justicia,-vida-y-libertad": {
    "partido": "Frente Amplio",
    "partido_id": "frente-amplio",
		"color": "#4e5405",
		"candidato_id": "marco-arana",
    "candidato": "Marco Arana"
	},
	"democracia-directa": {
		"partido": "Democracia Directa",
    "partido_id": "democracia-directa",
		"color": "#fff000",
		"candidato_id": "andres-alcantara",
    "candidato": "Andres Alcantara"
	}
}

data = []

def load_file(file):

	candidatos = []

	with open('departamentos_onpe.csv') as f:
		resultado_total = csv.DictReader(f)
		
		#	congreso_list(resultado_total)
		
		for d in resultado_total:
			print(d['cod'])

			json_resultados = json.load(open("regiones/%s.json" % d['cod']))
			
			for c in json_resultados["results"] :
				candidato = {}
				try:
					partido = partidos[(c['AGRUPACION']).replace(" ","-").lower()]
					candidato['departamento'] = d['departamento']
					candidato['region'] = (d['departamento']).replace(" ","-").lower()
					candidato['candidato_id'] = partido['candidato_id']
					candidato['candidato'] = partido['candidato']
					candidato['color'] = partido['color']
					candidato['partido'] = partido['partido']
					candidato['partido_id'] = partido['partido_id']
					candidato['total'] = int("%s" % c['TOTAL_VOTOS'].replace(",",""))
					candidato['validos'] = float(c['POR_VALIDOS'])
					candidato['emitidos'] = float(c['POR_VALIDOS'])
					candidato['conteo'] = 100 - float(json_resultados['generals']['generalData']['POR_POR_PROCESAR'])
					data.append(candidato)
				except:
					pass
			
	# 		candidatos.append(c)
	# 		for d in departamentos:
	# 			print(d, c['candidato_id'])
	# 			candidato = {}
	# 			candidato['region'] = d
	# 			candidato['candidato_id'] = c['candidato_id']
	# 			candidato['candidato'] = c['candidato']
	# 			candidato['color'] = c['color']
	# 			candidato['partido'] = c['partido']
	# 			candidato['partido_id'] = c['partido_id']
	# 			candidato['total'] = int(c['%s' % d])
	# 			candidato['validos'] = float(c['%s_validos' % d])
	# 			candidato['conteo'] = float(c['%s_conteo' % d])
	# 			data.append(candidato)

	# 	for d in departamentos:
	# 		if(d != 'total'):
	# 			distritos_list(d, candidatos)

	with open('../../public/data/%s.json' % file, 'w') as jsonf:
		jsonf.write(json.dumps(data, indent=2))


def congreso_list(resultado_total):
	data_out = []

	top_10 = sorted(resultado_total, key = lambda i: i['total'])[0:10]

	with open('candidatos_congreso.csv') as f:
		congresistas = csv.DictReader(f)

		for p in top_10:

			for d in departamentos:

				seleccionados = sorted(congresistas, key = lambda i: i['nro'])[0:10]

				candidato = {}
				#dni,nombre,region,departamento,nro,partido,partido_id
				candidato['region'] = c['region']
				candidato['candidato_id'] = c['candidato_id']
				candidato['dni'] = c['dni']
				candidato['candidato'] = c['nombre']
				candidato['color'] = c['color']
				candidato['partido'] = c['partido']
				candidato['partido_id'] = c['partido_id']

			data_out.append(candidato)
			
	export_congresistas(data_out)


def distritos_list(departamento, candidatos):
	data_out = []

	with open('%s.csv' % departamento) as f:
		distritos = csv.DictReader(f)

		for d in distritos:
			for c in candidatos:
				candidato = {}
				candidato['region'] = departamento

				if(departamento != 'extranjero'):
					print(departamento)
					candidato['candidato_id'] = c['candidato_id']
					candidato['candidato'] = c['candidato']
					candidato['color'] = c['color']
					candidato['partido'] = c['partido']
					candidato['partido_id'] = c['partido_id']
					candidato['departamento_id'] = departamento
					candidato['departamento'] = d['departamento']
					candidato['provincia'] = d['provincia']
					candidato['provincia_id'] = (d['provincia']).replace(" ","-").lower()
					candidato['ubigeo_reniec'] = d['ubigeo_reniec']
					candidato['ubigeo'] = d['ubigeo_inei']
					candidato['distrito_reniec'] = d['distrito_reniec']
					candidato['distrito'] = d['distrito_inei']
					candidato['conteo'] = random.randint(0,75)
					candidato['total_votos'] = random.randint(100000,300000)
					candidato['validos'] = random.randint(0,35)
					data_out.append(candidato)
				else:
						candidato['candidato_id'] = c['candidato_id']
						candidato['candidato'] = c['candidato']
						candidato['color'] = c['color']
						candidato['partido'] = c['partido']
						candidato['partido_id'] = c['partido_id']
						candidato['departamento_id'] = departamento
						candidato['departamento'] = departamento
						candidato['provincia'] = d['nombre']
						candidato['provincia_id'] = d['nombre']
						candidato['ubigeo_reniec'] = d['iso']
						candidato['ubigeo'] = d['iso']
						candidato['distrito'] = d['nombre']
						candidato['conteo'] = random.randint(0,75)
						candidato['total_votos'] = random.randint(100000,300000)
						candidato['validos'] = random.randint(0,35)
						data_out.append(candidato)

	export_departamento(data_out, departamento)


def export_departamento(data, departamento):
	with open('../public/data/%s.json' % departamento, 'w') as jsonf:
		jsonf.write(json.dumps(data, indent=2))


def export_congresistas(data):
	with open('../public/data/%s.json' % 'congres_total', 'w') as jsonf:
		jsonf.write(json.dumps(data, indent=2))

# {'desc_ubigeo_reniec': 'Chachapoyas', 'poblacion': '29171', 'latitud': '-6.2294', 'conteo': '', 'desc_dep_reniec': 'Amazonas', 'cod_prov_reniec': '0101', 'altitud': '2338', 'blancos_nulos': '', 'total_votos': '', 'longitud': '-77.8714', 'validos': '', 'cod_dep_reniec': '01', 'cod_ubigeo_reniec': '010101', 'superficie': '153.78', 'desc_prov_reniec': 'Chachapoyas'}



def init():

	resultados_total = load_file("resultados_total")


if __name__ == "__main__":

	init()