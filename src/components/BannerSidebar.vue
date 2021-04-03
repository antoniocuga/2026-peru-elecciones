<template>
  <div class="banner-landing mt-4 mb-3">
    <div class="col-12">
      <div class="aliados">
        <img :src="logoAliados" />
        <h3 class="title-1 mb-3">Vacúnate contra la desinformación</h3>
        <h3 class="title-2 mb-3">Apoya al periodismo independiente</h3>
      </div>
      <div class="aliados">
        <span class="line"></span>
        <h3 class="title-3 mb-3">Súmate a nuestra comunidad desde <span>S/. 13 soles al mes</span></h3>
      </div>
      <div class="aliados">
        <a class="btn" href="https://ojo-publico.com/aliados" target="_blank">Hazte Aliado</a>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "BannerSidebar",
    computed: {
      logoAliados() {
        return require('../assets/logo-aliados.png')
      }
    }
  }
</script>