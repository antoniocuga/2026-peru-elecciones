/home/grossir/venvs/py37/bin/python parse.py
Rscript -e "knitr::purl('/home/grossir/Desktop/Trabajos/OjoPublico/elecciones2021/crawler/transform.Rmd')"
Rscript -e "knitr::purl('/home/grossir/Desktop/Trabajos/OjoPublico/elecciones2021/crawler/transform_congreso.Rmd')"
Rscript transform.R
Rscript transform_congreso.R


scp "../public/data/congreso_total.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/resultados_total.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/amazonas.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/ancash.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/apurimac.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/arequipa.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/ayacucho.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/cajamarca.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/callao.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/cusco.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/huancavelica.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/huanuco.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/ica.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/junin.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/la-libertad.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/lambayeque.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/lima.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/lima-provincias.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/loreto.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/madre-de-dios.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/moquegua.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/pasco.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/piura.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/puno.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/san-martin.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/tacna.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/tumbes.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/
scp "../public/data/ucayali.json" antoniocucho@157.245.85.179:/var/www/ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/

