<template>
  <div class="row creditos mt-3 mb-3">
    <div class="col-12">
      <h4 class="mb-3 text-center mb-3">Últimas publicaciones</h4>
    </div>
    <div v-for="(a, ix) in articulos" class="col-6 col-md-4 articulos-item" :key="ix">
      <div class="article-image-max">
        <a :href="a.url" target="_blank"><img :src="a.imagen" /></a>
      </div>
      <h3><a :href="a.url" target="_blank">{{ a.titulo }}</a></h3>
      <p>{{ a.bajada }}</p>
    </div>
  </div>
</template>
<style lang="scss">
  .article-image-max {
    max-height: 200px;
    overflow: hidden;
  }
</style>
<script>

  export default {
    name: "Articulos",
    data() {
      return { 
        articulos: [
          {
            titulo: "Conspiración, desinformación y odio: el discurso de López Aliaga",
            url: "https://ojo-publico.com/especiales/conspiracion-desinformacion-odio-en-discurso-de-rafael-lopez-aliaga/",
            imagen: "https://ojo-publico.com/sites/default/files/styles/imagen_600x338/public/2021-04/Rafael_Lopez_Aliaga_Andina.jpeg?h=4362216e&itok=m9iB1jpM"
            
          },
          {
            titulo: "Las mentiras detrás del archivo de la denuncia de acoso contra Lescano",
            url: "https://ojo-publico.com/2598/las-mentiras-detras-del-archivo-de-la-denuncia-de-acoso-contra-lescano",
            imagen: "https://ojo-publico.com/sites/default/files/styles/imagen_745x419/public/2021-03/Lescano_Andina.jpg?h=ea95bb15&itok=O4yzNXD-"
            
          },
          {
            titulo: "Candidatos de Lescano defienden ascenso al poder de Merino",
            url: "https://ojo-publico.com/2610/candidatos-de-lescano-defienden-ascenso-al-poder-de-merino",
            imagen: "https://ojo-publico.com/sites/default/files/styles/imagen_600x338/public/2021-04/Lescano_Alva1.jpg?h=a876271e&itok=Vl1jpw6l"
            
          },
          {
            titulo: "José Luna y otros enemigos de la Sunedu en lista de Urresti",
            url: "https://ojo-publico.com/2557/jose-luna-y-otros-enemigos-de-la-sunedu-en-lista-de-urresti",
            imagen: "https://ojo-publico.com/sites/default/files/styles/imagen_352x198/public/2021-03/William%20Vega%20Mamani%20-%20facebook%20del%20candidato7.jpg?h=1565a4fb&itok=PN1TY5W7"
            
          },
          {
            titulo: "La polémica lista de elegidos por César Acuña al Congreso ",
            url: "https://ojo-publico.com/2531/la-polemica-lista-de-elegidos-por-cesar-acuna-al-congreso",
            imagen: "https://ojo-publico.com/sites/default/files/2021-03/Mari%CC%81a%20Acuna_1.jpeg"
            
          },
          {
            titulo: " López Aliaga: los negocios de un candidato ultraconservador",
            url: "https://ojo-publico.com/2520/lopez-aliaga-los-negocios-de-un-candidato-ultraconservador",
            imagen: "https://ojo-publico.com/sites/default/files/styles/imagen_544x306/public/2021-02/fotografia_lopez_aliaga_portada.jpg?h=029c4f0b&itok=-riF1YfH",
            
          },
          {
            titulo: "Madre Mía: candidato de Humala es investigado por sobornos",
            url: "https://ojo-publico.com/2469/madre-mia-candidato-de-humala-es-investigado-por-sobornos",
            imagen: "https://ojo-publico.com/sites/default/files/styles/imagen_544x306/public/2021-02/ollanta_humala_campa%C3%B1a_candidato.jpg?h=d5d02efb&itok=fwA4OVdV",
            
          },
          {
            titulo: "La UCV le entregó a César Acuña una casa de S/6,3 millones",
            url: "https://ojo-publico.com/2455/la-ucv-le-entrego-cesar-acuna-una-casa-de-s63-millones",
            imagen: "https://ojo-publico.com/sites/default/files/styles/imagen_544x306/public/2021-01/APP_0.jpg?h=4362216e&itok=9ejP1gge",
            
          },
          {
            titulo: "Forsyth acumuló patrimonio vehicular en base a donaciones",
            url: "https://ojo-publico.com/2450/forsyth-acumulo-patrimonio-vehicular-en-base-donaciones",
            imagen: "https://ojo-publico.com/sites/default/files/2021-01/george_Forsyth_victoria_nacional_portada.jpg",
            
          }
        ]
      }
    }
  }


</script>