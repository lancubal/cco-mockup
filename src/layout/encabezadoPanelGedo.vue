<template>
  <div class="p-d-flex p-jc-between encabezado">
    <div class="p-d-inline-flex">
      <div class="p-as-center">
        <h6>
          {{ store.state.gedo.curr_gedo.numeroSadeDocumento }}
        </h6>
        <div class="subtitulo">
          {{ store.state.gedo.curr_gedo.referencia }}
        </div>
      </div>
    </div>
    <div v-if="store.state.gedo.curr_gedo.fecha" class="p-d-flex p-as-center">
      <div class="p-col p-m-0 p-p-0 subtitle">
      <h6 class="p-text-right" style="color:#7a7575">&nbsp</h6>
      <div class="p-text-right" style="color:#7a7575">Fecha de Envío: {{format( store.state.gedo.curr_gedo.fecha,'dd/MM/yy HH:mm:ss ') }}</div>
    </div>
    </div>
  </div>
</template>
<script setup>
  import 'primeflex/primeflex.css'
  import format from "date-fns/format"

  import { useStore } from 'vuex'
  import { ref } from 'vue'
  const store = useStore()
  const op = ref()
  const toggle = (event) => {
    op.value.toggle(event)
  }
</script>
<style scoped>
  .boton-volver {
    font-size: 9pt;
    text-decoration: none;
    color: inherit;
  }
  .encabezado {
    padding-inline: 0.5rem;
    padding-bottom: 0.75rem;
    font-family: 'Encode Sans', Helvetica, Arial, sans-serif;
  }
  .encabezado-titulo {
    font-size: 18pt;
  }
   .subtitulo {
     width: 40vw;
    font-size: 12pt;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .logo {
    width: 27px;
    height: 45px;
    margin-right: 0.75rem;
    margin-left: 0.75rem;
  }
  .boton-usuario {
    font-size: 12pt;
    background: none;
    border-color: white;
    border-width: 0;
    margin-right: 0.75rem;
  }
  .info-usuario {
    font-size: 12pt;
  }
  .p-button.p-button-text {
    color: white;
    padding: 0rem;
  }
</style>
