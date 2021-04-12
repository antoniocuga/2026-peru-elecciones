import csv
import json
import random

resultados_total = []
departamentos = ['total','extranjero', 'lima','lima-provincias', 'callao', 'loreto', 'tumbes', 'piura', 'lambayeque', 'la-libertad', 'arequipa', 'moquegua', 'tacna', 'ica', 'ancash', 'amazonas', 'ayacucho', 'cusco', 'madre-de-dios', 'san-martin', 'ucayali', 'junin', 'puno', 'huanuco', 'pasco', 'cajamarca', 'huancavelica', 'apurimac']
data = []

def load_file(file):

	candidatos = []

	with open('%s.csv' % file) as f:
		resultado_total = csv.DictReader(f)
		
		#	congreso_list(resultado_total)
		
		for c in resultado_total:
			candidatos.append(c)
			for d in departamentos:
				print(d, c['candidato_id'])
				candidato = {}
				candidato['region'] = d
				candidato['candidato_id'] = c['candidato_id']
				candidato['candidato'] = c['candidato']
				candidato['color'] = c['color']
				candidato['partido'] = c['partido']
				candidato['partido_id'] = c['partido_id']
				candidato['total'] = int(c['%s' % d])
				candidato['validos'] = float(c['%s_validos' % d])
				candidato['conteo'] = float(c['%s_conteo' % d])
				data.append(candidato)

		for d in departamentos:
			if(d != 'total'):
				distritos_list(d, candidatos)

	with open('../public/data/%s.json' % file, 'w') as jsonf:
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