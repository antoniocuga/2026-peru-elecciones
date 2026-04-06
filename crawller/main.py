from flask import Flask, render_template
import gspread
import json
from datetime import datetime
from google.oauth2.service_account import Credentials

app = Flask(__name__)

scope = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
credenciales = Credentials.from_service_account_file("prueba.json", scopes=scope)
cliente = gspread.authorize(credenciales)

json_path = "dashboard.json"

def actualizar_dashboard_json():
    base = cliente.open("Candidatos_presidenciales_Cuentas_Redes_Sociales")
    hoja = base.sheet1
    values = hoja.get_all_values()

    if values:
        headers = values[0]
        # Make headers unique by appending suffixes if duplicates
        unique_headers = []
        seen = set()
        for h in headers:
            original_h = h
            i = 1
            while h in seen:
                h = f"{original_h}_{i}"
                i += 1
            unique_headers.append(h)
            seen.add(h)

        # Create list of dicts
        datos = [dict(zip(unique_headers, row)) for row in values[1:]]
    else:
        datos = []

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)
    print("✅ Datos actualizados en dashboard.json")

@app.route("/")
def index():
    with open(json_path, "r", encoding="utf-8") as f:
        datos = json.load(f)
    return render_template("index.html", datos=datos, now=datetime.now())

if __name__ == "__main__":
    actualizar_dashboard_json()
    app.run(debug=True)

