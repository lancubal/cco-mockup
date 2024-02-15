import { login as api_login, logout as api_logout } from "../../api/user.js"
import jwt_decode from "jwt-decode";
import store from "../store"
const getDefaultState = () => {
  return {
    tokenValido: true,
    tokens: null,
    nombre: '',
    userData: {},
  }
}

const state = getDefaultState()
const getters = (state) => {
  tokenValido: state => tokenValido
  nombre: state => nombre
  tokens: state => tokens
  userData: state => userData
}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
  , SET_TOKENS: (state, tokens) => {

    if (tokens) {
      try {
        var parsed = jwt_decode(tokens.accessToken)

        if (parsed["gde-accessToken"].user) {
          let ud = parsed["gde-accessToken"].user
          state.userData = ud
          //console.log("token userparsed", ud)
        }
      } catch (e) {
        console.log("Error parseando JWT", e)
      }
    }
    state.tokens = tokens
    sessionStorage.setItem('jwt', JSON.stringify(tokens))

  }, SET_USER_DATA: (state, data) => {
    state.userData = data
  }, SET_TOKEN_VALIDO: (state, valor) => {
    state.tokenValido = valor
    if(!valor)
      sessionStorage.clear();
  }
}
const actions = {
  setTokenValido({ commit }, valor) {
    commit("SET_TOKEN_VALIDO", valor)
  },

  login({ commit }, userInfo) {
    store.dispatch("app/set_dialog_text", null)
    console.log("user info", userInfo)
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      api_login({ username: username.trim(), password: password }).then(data => {
        console.log("res de login", data)
        commit('SET_TOKENS', { accessToken: data.accessToken, refreshToken: data.refreshToken })
        resolve()
      }).catch(error => {
        console.log("error", error)
        store.dispatch("app/set_dialog_text", error.message)
        reject(error)
      })
    })
  },
  async logout({ commit }) {
    let refreshToken = jwt_decode(state.tokens.refreshToken)
    try {
      let uuid = refreshToken["gde-refreshToken"].idAuth
      await api_logout({uuid: uuid })
      commit('SET_TOKENS', null)
      commit('SET_USER_DATA', {})
    } catch(e) {
      store.dispatch("app/set_dialog_text", "Error de conexión.")
    }
  }
}



export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

