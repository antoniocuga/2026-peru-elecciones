<template>
  <div>
    <twitter-button btnText class="share-button share-button--circle"/>
    <facebook-button btnText class="share-button share-button--circle"/>
    <whats-app-button btnText class="share-button share-button--circle"/>
    <telegram-button btnText class="share-button share-button--circle"/>
  </div>
</template>

<script>
  import WhatsAppButton from "vue-share-buttons/src/components/WhatsAppButton"
  import TelegramButton from "vue-share-buttons/src/components/TelegramButton"
  import TwitterButton from "vue-share-buttons/src/components/TwitterButton"
  import FacebookButton from "vue-share-buttons/src/components/FacebookButton"
 
 export default {
   name: "SharingOptions",
   components: {
     TwitterButton,
     FacebookButton,
     WhatsAppButton,
     TelegramButton
   },
 }
</script>

<style lang="scss">
  .share-button {
    min-width: 25px !important;
    min-height: 10px !important;
    padding: 5px 7px !important;
    border-radius: 42px;
    font-size: 11px;

    svg {
      width: 15px !important;
    }
  }

</style>