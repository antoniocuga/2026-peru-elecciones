wget "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuYN6ueYKnXJQ1tiGRuy2bLsEi-jlkCmUZLrzp4d6y_qORadVqmWobPzln7BJ7y9wqHEYJ3w1WYLm9/pub?gid=2039006160&single=true&output=csv" -O 'resultados_total.csv'


source ../venv/bin/activate

python3 api.py 