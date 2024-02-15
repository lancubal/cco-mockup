<template>
  <div class="p-d-flex p-jc-between encabezado">
    <div class="p-d-inline-flex">
      <img class="p-as-center logo" v-tooltip.right="{ value: '- version ' + app_version + ' -', class: 'version' }" src="/escudo.png" alt="Escudo Nacional" />
      <div class="p-as-center">
        <div
          class="p-text-bold encabezado-titulo"
          tabindex="0"
          :aria-label="'Expediente ' + store.state.ee.ee_num"
          v-if="store.state.ee.ee_num != 'cargando'"
        >
          <div>
            VISOR DE COMUNICACIONES OFICIALES
          </div>
        </div>
      </div>
    </div>
    <div class="p-as-center" v-if="store.state.user.tokens && enable_v2 && !store.state.ee.ee_num">
      <span class="p-input-icon-left">
        <i @click="do_search()" class="pi pi-search search_icon" style="margin-bottom: 1em" />
        <InputText type="text" v-model="ee" placeholder="Busqueda de expediente" style="width:25vw" @keyup.enter="do_search()" />
      </span>
    </div>
    <div
      v-if="store.state.user.tokens"
      class="p-d-flex info-usuario p-as-center"
      tabindex="0"
      :aria-label="'Usuario ' + store.state.user.userData['username']"
    >
      <div>
        <div class="p-as-center p-mr-2" style="float: left">
          {{ store.state.user.userData["username"] }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { version } from "../../package.json";
import "primeflex/primeflex.css";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import InputText from "primevue/inputtext";
import { useStore } from "vuex";
import { ref } from "vue";

const enable_v2 = import.meta.env.VITE_APP_V2 == 'true'

const app_version = version
console.log("app_version", app_version);

const store = useStore();
const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
};

let ee = ref('')

async function do_logout() {
  try {
    sessionStorage.clear();
    await store.dispatch("user/logout")
    await store.commit('ee/RESET_STATE')
    await store.commit('gedo/RESET_STATE')
    await store.commit('user/RESET_STATE')
  } catch (error) {
    store.state.app.commit("app/SET_DIALOG_TEXT", error.message)
  }
}

async function do_search() {
  try {
    await store.dispatch("ee/traer_ee", ee.value)
  } catch (error) {
    store.commit("app/SET_DIALOG_TEXT", error.message)
  }
  ee.value = ''
}

</script>

<style scoped>
.encabezado {
  padding-inline: 0.25rem;
  padding-bottom: 0.75rem;
  padding-top: 0.5rem;
  font-family: "Encode Sans", Helvetica, Arial, sans-serif;
  color: white;
  background-color: #366ec9f2;
}
.encabezado-titulo {
  font-size: 18pt;
}
.encabezado-subtitulo {
  font-size: 12pt;
}
.logo {
  width: 27px;
  height: 45px;
  margin-right: 0.75rem;
  margin-left: 0.75rem;
}
.info-usuario {
  font-size: 12pt;
  background: none;
  border-color: white;
  border-width: 0;
  margin-right: 1.5rem;
}
.log-out {
  font-size: small;
  cursor: pointer;
  margin-left: 0.5em;
}
.search_icon {
  cursor: pointer;
}
</style>

<style lang="scss">
  .version.p-tooltip{
    position: absolute;
    left: 10px !important;
    margin-top: 20px;
    margin-left: 40px;
    max-width: 25rem;
    .p-tooltip-text{
      font-size: 18px;
      width:fit-content;
      border-radius: 0;
      background-color: white ;
      color: black ;
    }
    .p-tooltip-arrow{
      visibility: hidden;
    }
  }
</style>
