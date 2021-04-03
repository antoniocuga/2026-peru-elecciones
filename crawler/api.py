import csv
import json

resultados_total = []
departamentos = ['lima', 'callao', 'loreto', 'tumbes', 'piura', 'lambayeque', 'la-libertad', 'arequipa', 'moquegua', 'tacna', 'ica', 'ancash', 'amazonas', 'ayacucho', 'cusco', 'madre-de-dios', 'san-martin', 'ucayali', 'junin', 'puno', 'huanuco', 'pasco', 'cajamarca', 'huancavelica', 'apurimac']

def load_file(file):

	data = []

	with open('%s.csv' % file, newline='') as f:
		resultado = csv.DictReader(f)

		for c in resultado:
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

	with open('../public/data/%s.json' % file, 'w', encoding='utf-8') as jsonf:
			jsonf.write(json.dumps(data, indent=2))

def init():

	resultados_total = load_file("resultados_total")

if __name__ == "__main__":

	init()