while IFS=',' read -r guid field
do
    curl 'https://api.resultados.eleccionesgenerales2021.pe/results/10/'$guid'?name=param' -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:86.0) Gecko/20100101 Firefox/86.0' -H 'Accept: application/json, text/plain, */*' -H 'Accept-Language: en-US,en;q=0.5' --output 'regiones/'$guid'.json'
done < departamentos_onpe.csv