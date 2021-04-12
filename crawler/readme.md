La data está viviendo en una BD de Mongo

## 1. para correr el scraper

```
scrapy runspider onpe.py -a mode=summary
```
No deberia ser necesaria esta parte manual, estoy corriendo el scraper cada 20 minutos con un cron


## 2. para extraer la data, usando un env de python apropiado

- instalar requerimientos en requirements.txt


```
python parse.py
```

## 3. Para convertir la data la formato apropiado

```
Rscript transform.R
```

## 4. Para subirla, comitearla?