if (!require("dplyr")){
    install.packages(
        c("dplyr", "readr", "stringr", "jsonlite")
    )    
}

library(dplyr)
library(readr)
library(stringr)
library(jsonlite)




muestra <- read_csv("muestra_resumen_distrito.csv", col_types = cols(.default = "c"))
mapper <- read_csv("map_candidates_to_viz.csv")
ubigeo_mapper <- read_csv("tabla_equivalencias - Hoja 1.csv")

no_contar <- c("TOTAL DE VOTOS EMITIDOS", "VOTOS EN BLANCO", "VOTOS NULOS", "TOTAL DE VOTOS VÁLIDOS")

bruto <- 
    muestra %>% 
    mutate(
        dep = if_else(dep == "LIMA" & prov != "LIMA", "LIMA-PROVINCIAS", dep),
        TOTAL_VOTOS = as.numeric(str_replace(TOTAL_VOTOS, ",", ""))
    ) %>% 
    filter(
        !AGRUPACION %in% no_contar
    ) %>% 
    group_by(dep, prov, dist) %>% 
    mutate(total_por_dist = sum(TOTAL_VOTOS)) %>% 
    ungroup() %>% 
    group_by(dep) %>% 
    mutate(total_por_dep = sum(TOTAL_VOTOS)) %>% 
    group_by(AGRUPACION, dep) %>%
    summarise(
        total = sum(TOTAL_VOTOS),
        validos = sum(total_por_dist * (as.numeric(POR_VALIDOS)/100)),
        
        
        # Se refiere al porcentaje de validos que tiene en este departamento
        por_validos = validos/total_por_dep * 100
    ) %>%
    ungroup() %>% 
    distinct()

por_dep <- 
    bruto%>% 
    inner_join(mapper, by = c("AGRUPACION")) %>% 
    select(-contains("Unnamed"), -validos) %>% 
    rename(departamento = dep, validos=por_validos) %>% 
    mutate(region = tolower(departamento)) %>% 
    select(-AGRUPACION, -NOMBREe_CANDIDATO)

jsonlite::toJSON(por_dep, pretty = T) %>% write("../public/data/resultados_total.json")

brutodist <- 
    muestra %>% 
    group_by(AGRUPACION, dep, prov, dist, ubigeo) %>% 
    summarise(
        total_votos = sum( as.numeric(str_replace(TOTAL_VOTOS, ",", ""))),
        validos = sum(total_votos * (as.numeric(POR_VALIDOS)/100)),
        
        por_procesar = as.numeric(POR_PROCESAR),
        procesadas = as.numeric(ACTAS_PROCESADAS),
        total_actas = por_procesar + procesadas, 
        conteo = procesadas/total_actas * 100
        
    ) %>%
    ungroup() %>% ungroup() %>% 
    inner_join(mapper, by = c("AGRUPACION")) %>% 
    select(-contains("Unnamed")) %>% 
    mutate(
        departamento = str_to_title(dep),
        provincia = str_to_title(prov),
        distrito = str_to_title(dist),
        ubigeo_reniec = ubigeo
    ) %>% 
    inner_join(
        ubigeo_mapper %>% select(contains("ubigeo"))
    ) %>% 
    mutate(
        region = tolower(departamento),
        departamento_id = tolower(departamento),
        provincia_id = tolower(provincia),
        distrito_id = tolower(distrito)
    ) %>% 
    select(-AGRUPACION, -NOMBREe_CANDIDATO, -dep, -prov, -dist, -ubigeo, -por_procesar, -procesadas)


filter(brutodist, departamento_id=="amazonas") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/amazonas.json")
filter(brutodist, departamento_id=="ancash") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/ancash.json")
filter(brutodist, departamento_id=="apurimac") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/apurimac.json")
filter(brutodist, departamento_id=="arequipa") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/arequipa.json")
filter(brutodist, departamento_id=="ayacucho") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/ayacucho.json")
filter(brutodist, departamento_id=="cajamarca") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/cajamarca.json")
filter(brutodist, departamento_id=="callao") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/callao.json")
filter(brutodist, departamento_id=="cusco") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/cusco.json")
filter(brutodist, departamento_id=="huancavelica") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/huancavelica.json")
filter(brutodist, departamento_id=="huanuco") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/huanuco.json")
filter(brutodist, departamento_id=="ica") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/ica.json")
filter(brutodist, departamento_id=="junin") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/junin.json")
filter(brutodist, departamento_id=="la libertad") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/la-libertad.json")
filter(brutodist, departamento_id=="lambayeque") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/lambayeque.json")
filter(brutodist, departamento_id=="lima") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/lima.json")
filter(brutodist, departamento_id=="loreto") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/loreto.json")
filter(brutodist, departamento_id=="madre de dios") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/madre-de dios.json")
filter(brutodist, departamento_id=="moquegua") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/moquegua.json")
filter(brutodist, departamento_id=="pasco") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/pasco.json")
filter(brutodist, departamento_id=="piura") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/piura.json")
filter(brutodist, departamento_id=="puno") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/puno.json")
filter(brutodist, departamento_id=="san martin") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/san-martin.json")
filter(brutodist, departamento_id=="tacna") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/tacna.json")
filter(brutodist, departamento_id=="tumbes") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/tumbes.json")
filter(brutodist, departamento_id=="ucayali") %>% jsonlite::toJSON(pretty = T) %>% write("../public/data/ucayali.json")