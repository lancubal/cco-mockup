<template>
  <div v-if="store.state.ee.documentos_vinculados.length" class="row">

    <TabView class="customtab">
      <TabPanel>
        <template #header>
          <i class="pi pi-file-o p-mr-1"></i>
          <span>BANDEJA DE COMUNICACIONES</span>
        </template>
        <div class="p-mx-2 p-mt-0 p-grid">
          <div
            class="p-col-fixed collapsable gedos"
            :class="{ collapsed: isGedosCollapsed }"
          >
            <gedos></gedos>
          </div>
          <div
            class="p-col p-px-2"
            v-if="
              !store.state.gedo.trayendo_gedo &&
              store.state.gedo.trayendo_gedo != null
            "
            style="border-left: 1px solid #c8c8c8"
          >
            <encabezadoPanelGedo
              style="border-bottom: 1px solid #c8c8c8"
            ></encabezadoPanelGedo>
            <div class="p-grid p-m-0 p-p-0">
              <div class="p-col p-m-0 p-p-0">
                <visorpdf></visorpdf>
              </div>
              <div
                class="p-col p-px-2 box collapsable detalle-gedo"
                :class="{ collapsed: isDetalleGedoCollapsed }"
              >
                <detallegedo></detallegedo>
              </div>
            </div>
          </div>
          <div v-else class="p-col">
            <div class="p-d-flex">
              <ProgressSpinner
                class="p-as-center p-mt-4"
                style="width: 50px; height: 50px"
                strokeWidth="8"
                animationDuration=".7s"
              />
            </div>
          </div>
        </div>
      </TabPanel>
    </TabView>
  </div>
  <div v-if="store.state.ee.ee_num == 'cargando' && store.state.user.tokenValido" class="row">
            <div class="p-d-flex">
              <ProgressSpinner
                class="p-as-center p-mt-4"
                style="width: 50px; height: 50px"
                strokeWidth="8"
                animationDuration=".7s"
              />
            </div>
          </div>
</template>

<script setup>
  import { computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import 'primeflex/primeflex.css'
  import Button from 'primevue/button'
  import ProgressSpinner from 'primevue/progressspinner'
  import TabPanel from 'primevue/tabpanel'
  import TabView from 'primevue/tabview'
  import detallegedo from '../layout/detallegedo.vue'
  import encabezadoPanelGedo from '../layout/encabezadoPanelGedo.vue'
  import gedos from '../layout/gedos.vue'
  import visorpdf from '../layout/visorpdf.vue'

  const store = useStore()

  const enable_v2 = import.meta.env.VITE_APP_V2 == 'true'

  const isGedosCollapsed = computed(() => store.state.app.gedos_isCollapsed)

  const isDetalleGedoCollapsed = computed(
    () => store.state.app.detalleGedo_isCollapsed
  )

  onMounted(async () => {
    var ee = store.state.ee.ee_num
    if (ee && (store.state.user.tokenValido || enable_v2)) {
      try {
        await store.dispatch("ee/traer_ee", ee);
      } catch (error) {
        store.commit("app/SET_DIALOG_TEXT", error.message)
      }
    }
  })
</script>
<style lang="scss" scoped>
  .input_text {
    width: 300px;
  }

  .collapsable {
    transition-duration: 0.2s;

    &.gedos {
      width: 380px;

      &.collapsed {
        width: 75px;
      }
    }

    &.detalle-gedo {
      max-width: 350px;

      &.collapsed {
        max-width: 75px;
      }
    }
  }

  #app {
    font-family: 'Encode Sans', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  ::v-deep(.p-tabview) {
    &.customtab {
      .p-tabview-nav .p-tabview-nav-link {
        line-height: 0rem;
        margin: 0rem;
        border-top: 0rem;
        border-right: 0rem;
        border-left: 0rem;
        font-family: 'Encode Sans', sans-serif;
        font-size: 16px;
      }
    }
  }
</style>
<style lang="scss">

  .hidden {
    opacity: 0;
  }

  ::v-deep(.p-scrollpanel) {
    &.custombar {
      height: 70vh;
      overflow: hidden;
      .p-scrollpanel-bar {
        background-color: rgba(95, 146, 204, 0.4);
        opacity: 1;
        transition: background-color 0.2s;
        &:hover {
          background-color: rgba(95, 146, 204, 0.952);
        }
      }
    }
  }

  ::-webkit-scrollbar {
    width: 9px;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: rgba(95, 146, 204, 0.4);
    border-radius: 3px;
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(95, 146, 204, 0.952);
  }

  .collapsableButton, .btn_descarga_zip, .btn_error {
    transition-duration: 0.2s;
    padding-right: 13px;
  }

  :not(.gedos.collapsed) .collapsableButton, :not(.detalle-gedo.collapsed) .collapsableButton, .btn_descarga_zip, :not(.detalle-gedo.collapsed) .btn_error {
    width: 370px;
    position: fixed;
  }

  :not(gedos.collapsed) .collapsableButton, :not(detalle-gedo.collapsed) .collapsableButton {
    bottom: 0;
  }

  .btn_descarga_zip {
    bottom: 58px;
  }

  .btn_error {
    bottom: 116px;
  }

  label.etiqueta {
    font-family: 'Encode Sans', Helvetica, Arial, sans-serif;
    font-size: 14px;
    pointer-events: none;
    position: absolute;
    top: 22px;
    color: #555;

    &.izquierda {
      right: 60px;
    }
    &.derecha {
      left: 70px;
    }
  }

  .collapsable.collapsed label.etiqueta {
    display: none;
  }

  .gedos.collapsed .collapsableButton, .gedos.collapsed .btn_descarga_zip, .gedos.collapsed .info_panel,
  .detalle-gedo.collapsed .collapsableButton, .detalle-gedo.collapsed .btn_descarga_zip, .detalle-gedo.collapsed.btn_error  {
    width: 65px;
  }

  .collapsableButton, .btn_descarga_zip, .btn_error {
    background: white;
    padding: 10px;
    margin: 0;
    z-index: 2;
  }

  .collapsableButton:hover {
    cursor: pointer;
  }

  .collapsableButton:hover, .btn_descarga_zip:hover, .btn_error:hover {
    background-color: #eee;
  }

  .detalle-gedo.collapsable.collapsed .p-tabview {
    .p-tabview-panels,
    li .p-tabview-nav-link {
      border-width: 0;
    }
  }

  
</style>
