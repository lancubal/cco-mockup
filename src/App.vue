<template>
  <Dialog 
    header="ACCESO RESTRINGIDO"
    :visible="!enable_v2 && !gotToken" 
    :modal="true" 
    :closable='false' 
    :draggable='false' 
    :style="{width: '700px'}" 
    class="expireDialog">
       <p>
        Ha intentado acceder al VISOR de forma incorrecta o sin una sesión activa en GDE.
       </p>
       <p>&nbsp;</p>
       <p>
        Para continuar utilizando la aplicación, le recomendamos acceder nuevamente a través de <br> "Ir a Expediente Electrónico", iniciando sesión si el sistema lo requiere.
       </p>
       <p>&nbsp;</p>
       <p>
        Si el error persiste y necesita asistencia, por favor, contacte a nuestro equipo de soporte.
       </p>
       <p>&nbsp;</p>
       <div class="dialog_botonera">
         <Button class="dialog_button" @click="openURL(url_login)" label="Ir a Expediente Electrónico"></Button>
         <Button class="dialog_button" @click="close_window()" label="Cerrar Visor"></Button>
         <Button class="dialog_button" @click="openNewTab(url_report_error)" label="Ir a Centro de Soporte"></Button>
       </div>
  </Dialog>
  <Dialog
    :visible="store.state.app.error_handler != null && (gotToken || enable_v2)"
    :modal="true"
    :closable="false"
    :draggable='false' 
    :header="store.state.app.error_handler != null ? store.state.app.error_handler.header : ''"
    class="expireDialog"
    :style="{ width: '650px' }"
  >
    <div style="text-align: center">
      <p class="p-m-0">
        {{ store.state.app.error_handler.message }}
      </p>
      <div>
        <div style="display: flex; width: 100%; margin: auto; justify-content: center;" v-if="store.state.app.error_handler.boton == 'expediente'">
          <Button  class="dialog_button" @click="openURL(url_login)" label="Ir a Expediente Electrónico" />
          <Button class="dialog_button" @click="close_window()" label="Cerrar Visor"></Button>
        </div>
        
        <Button v-if="store.state.app.error_handler.boton == 'aceptar'" class="dialog_button" @click="store.dispatch('app/set_error_handler', null)" label="Aceptar" />
      </div>
    </div>
  </Dialog>
  <Dialog 
    header="CIERRE DE SESIÓN AUTOMÁTICO"
    :visible="!store.state.user.tokenValido && (gotToken || enable_v2) && store.state.app.error_handler == null" 
    :modal="true" 
    :closable='false' 
    :draggable='false' 
    :style="{width: '650px'}" 
    class="expireDialog">
       <p>Su sesión ha expirado en el VISOR o ha sido cerrada en GDE.</p>
       <p>&nbsp;</p>
       <p>Para continuar utilizando la aplicación, le recomendamos acceder nuevamente a través de "Ir a Expediente Electrónico", iniciando sesión si el sistema lo requiere.</p>
       <p>&nbsp;</p>
       <div class="dialog_botonera">
        <Button class="dialog_button" @click="openURL(url_login)" label="Ir a Expediente Electrónico"></Button>
        <Button class="dialog_button" @click="close_window()" label="Cerrar Visor"></Button>
      </div>
  </Dialog>
  <Dialog
    :visible="store.state.app.dialog_text != null && store.state.user.tokenValido && (gotToken || enable_v2) && store.state.app.error_handler == null"
    :modal="true"
    :closable="false"
    :draggable='false' 
    :style="{ width: '50vw' }"
  >
    <div style="text-align: center">
      <p class="p-m-0">
        {{ store.state.app.dialog_text }}
      </p>
    </div>
    <template #footer>
      <Button label="OK" @click="store.dispatch('app/set_dialog_text', null)">
      </Button>
    </template>
  </Dialog>
  <encabezado></encabezado>
  <router-view/>
</template>

<script setup>
  import {
    computed,
    onMounted,
    ref,
    watch
  } from "vue";
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";

  import Button from 'primevue/button'
  import Dialog from 'primevue/dialog'

  import { renewAccessToken } from './api/user'
  import { get_url_params, clear_url_params } from './helpers/utils'

  import encabezado from './layout/encabezado.vue'

  const url_login = import.meta.env.VITE_APP_LOGIN_URL
  const url_report_error = import.meta.env.VITE_APP_REPORT_ERROR_URL
  const enable_v2 = import.meta.env.VITE_APP_V2 == 'true'

  const store = useStore()
  const router = useRouter()

  function openURL(url) {
    window.location.href = url
  }

  function openNewTab(url){
    window.open(url,'_blank')
  }

  function close_window() {
  close()
}

  let refreshTimeoutId = ref(null)
  let gotToken = ref(true)

  let isLogged = computed(() => store.state.user.tokens)
  watch(isLogged, checkSessionStatus)

  function checkSessionStatus() {
    if (isLogged.value) {
      if (!refreshTimeoutId.value) {
        refreshToken()
        refreshTimeoutId.value = setInterval(refreshToken, 1000 * 60 * 4)
        router.push("/visor-ee")
      }
    }
    else {
      if (refreshTimeoutId.value) {
        clearInterval(refreshTimeoutId.value)
        refreshTimeoutId.value = null
      }
      if(enable_v2)
        router.push("/")
    }
  }

  async function refreshToken() {
    try {
      var res = await renewAccessToken()
      console.log('rt', new Date(), res)
      store.commit('user/SET_TOKENS', {
        accessToken: res.newAccessToken,
        refreshToken: store.state.user.tokens.refreshToken
      })
    } catch (error) {
        clearInterval(refreshTimeoutId.value)
        refreshTimeoutId.value = null
        if (enable_v2) {
          store.dispatch('app/set_dialog_text', "Se vencio la sesion. Por favor vuelva a iniciar sesion")
          } else {
          store.commit("user/SET_TOKEN_VALIDO", false)
        }
    }
  }

  onMounted(() => {
    var params = get_url_params()
    clear_url_params()
    console.log(
      "ee",
      params["ee"],
      "jwt",
      params["jwt"],
      "gedo",
      params["gedo"]
    )
    var ee = params['ee'] ? params['ee'] : sessionStorage.getItem('ee')
    var gedo = params['gedo']
    var tokenObj = null
    try{
      tokenObj = params['jwt'] ? JSON.parse(atob(params['jwt'])) : JSON.parse(sessionStorage.getItem('jwt'))
    }catch(error){
      store.commit("user/SET_TOKEN_VALIDO", false)
    }

    if (!tokenObj)
      gotToken.value = false

    if (gedo)
      store.commit('ee/SET_GEDO_NUM', gedo)
    if (ee) {
      ee = decodeURIComponent(ee).replaceAll('+', ' ')
      store.commit('ee/SET_EE_NUM', ee)
    }
    if (tokenObj) {
        store.commit('user/SET_TOKENS', {
          accessToken: tokenObj.accessToken,
          refreshToken: tokenObj.refreshToken
        })
    }
  })

</script>

<style lang="scss">
  .expireDialog {

    p {
      text-align: center;
      width: 100%;
      font-size: 12pt;
      line-height: 1.6;
      margin: 0px;
    }

    .p-dialog-title {
      text-align: center;
      width: 100%;
      margin: 10px 0;
    }
}

.dialog_button{
  font-size: 11pt !important;
  width: 33%;
  margin: 10px !important;
}

.dialog_botonera { 
  display: flex;
  width: 85%;
  margin: auto;
  justify-content: center;
}
</style>
