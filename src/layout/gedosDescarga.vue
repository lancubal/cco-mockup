<template>
  <Dialog
    :showHeader=false
    class='dialog_procesando'
    v-model:visible="flags.dialog_visible"
    v-if="flags.obteniendo"
    :style="{width: '430px'}"
    :contentStyle="{height: '70px'}"
    position="bottomleft"
  >
    <div class='dialog dialog_cargando'>
      <ProgressSpinner
        style="width: 30px; height: 30px"
        strokeWidth="8"
        animationDuration="3s"
      />
      <label>PROCESANDO ARCHIVO</label>
    </div>
  </Dialog>
  <Dialog
    :modal=true
    header="PROCESO FINALIZADO"
    v-model:visible="flags.dialog_visible"
    v-if="!flags.obteniendo && !zip_results.conDocsNoDescargados"
    :style="{width: '500px'}"
    position="bottomleft"
    :breakpoints="{'960px': '75vw', '640px': '100vw'}"
  >
    <div class='dialog dialog_todos'>
      <label>Todos los documentos se encuentran disponibles</label>
      <Button
        class='zip_boton'
        @click="descargar_zip"
      >
        Descargar
      </Button>
    </div>
  </Dialog>
  <Dialog
    :modal=true
    header="PROCESO CANCELADO"
    v-model:visible="flags.dialog_visible"
    v-if="!flags.obteniendo && zip_results.conDocsNoDescargados && flags.sinDocsDescargados"
    :style="{width: '620px'}"
    position="bottomleft"
  >
    <div class='dialog dialog_ninguno'>
      <label>No cuenta con permiso para descargar los documentos de este Expediente</label>
      <Button
        class='zip_boton'
        @click="flags.dialog_visible = false"
      >
        Aceptar
      </Button>
    </div>
  </Dialog>
  <Dialog
    :modal=true
    header='PROCESO FINALIZADO'
    v-model:visible="flags.dialog_visible"
    v-if="!flags.obteniendo && zip_results.conDocsNoDescargados && !flags.sinDocsDescargados"
    :style="{ width: '30vw' }"
    style="min-width: 450px"
  >
    <div class="dialog dialog_algunos" >
      <h6 class='zip_titulo'>Documentos no disponibles para su perfil:</h6>
      <Divider></Divider>
      <div class="zip_lista">
        <div v-if="zip_results.nrosDocReservadosNoDescargados.length != 0">
          <p class='zip_subtitulo'>Reservados:</p>
          <ul>
            <li v-for="doc in zip_results.nrosDocReservadosNoDescargados">
              {{ doc }}
            </li>
          </ul>
        </div>
        <div v-if="zip_results.nrosDocSubsanadosNoDescargados.length != 0">
          <p class='zip_subtitulo'>Subsanados:</p>
          <ul>
            <li v-for="doc in zip_results.nrosDocSubsanadosNoDescargados">
              {{ doc }}
            </li>
          </ul>
        </div>
        <div v-if="zip_results.nrosDocNoDescargados.length != 0">
          <p class='zip_subtitulo'>Error de sistema</p>
          <ul>
            <li v-for="doc in zip_results.nrosDocNoDescargados">
              {{ doc }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        class='zip_boton'
        @click="descargar_zip"
      >
        Descargar
      </Button>
    </template>
  </Dialog>
</template>

<script setup>
  import Button from 'primevue/button'
  import Dialog from 'primevue/dialog'
  import ProgressSpinner from 'primevue/progressspinner'

  import { download_base64 } from '../helpers/utils'
  import Divider from '../components/Divider.vue'

</script>
<script>
  export default {
    props: {
      store: Object,
      zip_results: Object,
      flags: Object
    },
    methods: {
      descargar_zip: function() {
        download_base64(this.zip_results.zipBase64, this.store.state.ee.ee_num + '.zip')
        this.flags.dialog_visible = false
        this.zip_results.zipBase64 = ''
      }
    }
  }
</script>

<style lang="scss" scoped>

  .dialog {

    .zip_boton {
      position: absolute;
      right: 10px;
      bottom: 10px;
      font-size: 0.9rem;
    }

    label {
      font-size: 0.9rem;
    }

    &.dialog_cargando {
      position: absolute;
      left: 30px;
      width: 100%;

      .p-progress-spinner {
        top: 2px;
      }

      label {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 25px;
      }
    }

    &.dialog_todos {
    }

    &.dialog_ninguno {
    }

    &.dialog_algunos {
      height: 50vh;
      overflow: hidden;
      transition-duration: 0.5s;

      .separator {
        padding: 15px 0 0;
      }
      .zip_titulo {
        font-size: 0.9rem;
      }
      .zip_subtitulo {
        font-size: 0.9rem;
        font-weight: 700;
        color: #444;
      }
      .zip_lista {
        height: 45vh;
        overflow-y: scroll;
        ul {
          list-style: circle;
          text-align: left;
          padding: 0 30px;
          margin-top: 0;
          li {
            font-size: 0.9rem;
            padding-bottom: 10px;
          }
        }
      }
    }
  }

  .zip_boton {
    font-size: 0.9rem;
  }

</style>
<style>
  .dialog_procesando.p-dialog .p-dialog-content {
    background-color: #DDF3F9;
    border-color: #0F82DB;
    border-style: solid;
    border-width: 1px;
  }
</style>