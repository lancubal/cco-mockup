<template>
  <div v-if="enable_v2"  class="page-login">
    <div class="center">
      <h1>Visor de expedientes electronicos:</h1>
      <span class="p-input-icon-right text-field">
        <label>Usuario</label>
        <i class="pi pi-id-card" />
        <InputText type="text" v-model="userData.username" @keyup.enter="userData.password ? do_login() : ''" />
      </span>

      <span class="p-input-icon-right text-field">
        <label>Contraseña</label>
        <i
          class="pi"
          :class="{
            'pi-lock': !userData.password,
            'pi-angle-right boton-login': userData.password,
          }"
          @click="userData.password ? do_login() : ''"
        />
        <InputText
          type="password"
          v-model="userData.password"
          @keyup.enter="userData.password ? do_login() : ''"
        />
        <small v-for="error in errors" :key="error" class="p-error">
          {{error}}
        </small>
      </span>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useStore } from "vuex";
  import InputText from "primevue/inputtext";
  import { download_base64 } from "../helpers/utils";

  const store = useStore();

  const enable_v2 = import.meta.env.VITE_APP_V2 == 'true'

  let userData = ref({ username: "", password: "" })
  let errors = ref([])

  async function do_login() {
    errors.value = []
    try {
      await store.dispatch("user/login", userData.value)
    } catch (error) {
      errors.value.push(error.message)
    }
  }
</script>
<style lang="scss" scoped>
.boton-login {
  cursor: pointer;
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: white;
  border-radius: 10px;
  box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.05);
}

.center h1 {
  color: #000000;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
}

.text-field {
  position: relative;
  border-bottom: 2px solid #adadad;
  margin: 20px 90px;
  height: 40px;
  border: none;
  background: none;
  outline: none;
}

.text-field label {
  position: absolute;
  bottom: 100%;
  left: 5px;
  color: #adadad;
}
</style>