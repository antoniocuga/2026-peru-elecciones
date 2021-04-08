import csv
import json
import random

resultados_total = []
departamentos = ['lima','lima-provincias', 'callao', 'loreto', 'tumbes', 'piura', 'lambayeque', 'la-libertad', 'arequipa', 'moquegua', 'tacna', 'ica', 'ancash', 'amazonas', 'ayacucho', 'cusco', 'madre-de-dios', 'san-martin', 'ucayali', 'junin', 'puno', 'huanuco', 'pasco', 'cajamarca', 'huancavelica', 'apurimac']
data = []

def load_file(file):

	candidatos = []

	with open('%s.csv' % file) as f:
		resultado_total = csv.DictReader(f)
		
		for c in resultado_total:

			candidatos.append(c)

			for d in departamentos:
				candidato = {}
				candidato['region'] = d
				candidato['candidato_id'] = c['candidato_id']
				candidato['candidato'] = c['candidato']
				candidato['color'] = c['color']
				candidato['partido'] = c['partido']
				candidato['partido_id'] = c['partido_id']
				candidato['nacional'] = float(c['total'])
				candidato['total_departamento'] = c[d]
				candidato['validos_nacional'] = float(c['porcentaje_validos'])
				data.append(candidato)

	
	distritos_list(candidatos)

	with open('../public/data/%s.json' % file, 'w') as jsonf:
			jsonf.write(json.dumps(data, indent=2))

	


def distritos_list(candidatos):
	data_out = []

	with open('lambayeque.csv') as f:
		distritos = csv.DictReader(f)

		
		for d in distritos:
			for c in candidatos:
				candidato = {}
				candidato['region'] = (d['desc_dep_inei']).lower().replace(" ","-")
				candidato['candidato_id'] = c['candidato_id']
				candidato['candidato'] = c['candidato']
				candidato['color'] = c['color']
				candidato['partido'] = c['partido']
				candidato['partido_id'] = c['partido_id']
				candidato['departamento_id'] = d['cod_dep_inei']
				candidato['departamento'] = d['desc_dep_inei']
				candidato['provincia'] = d['desc_prov_inei']
				candidato['provincia_id'] = d['cod_prov_inei']
				candidato['ubigeo'] = d['cod_ubigeo_inei']
				candidato['distrito'] = d['desc_ubigeo_inei']
				candidato['conteo'] = random.randint(0,75)
				candidato['total_votos'] = random.randint(100000,300000)
				candidato['validos'] = random.randint(0,35)
				data_out.append(candidato)

	export_departamento(data_out)


def export_departamento(data):
	with open('../public/data/%s.json' % 'lambayeque', 'w') as jsonf:
		jsonf.write(json.dumps(data, indent=2))

# {'desc_ubigeo_reniec': 'Chachapoyas', 'poblacion': '29171', 'latitud': '-6.2294', 'conteo': '', 'desc_dep_reniec': 'Amazonas', 'cod_prov_reniec': '0101', 'altitud': '2338', 'blancos_nulos': '', 'total_votos': '', 'longitud': '-77.8714', 'validos': '', 'cod_dep_reniec': '01', 'cod_ubigeo_reniec': '010101', 'superficie': '153.78', 'desc_prov_reniec': 'Chachapoyas'}



def init():

	resultados_total = load_file("resultados_total")


if __name__ == "__main__":

	init()