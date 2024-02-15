import { ee_detalle as api_ee_detalle, ee_historial as api_ee_historial } from "../../api/ee.js"
import format from "date-fns/format"
import store from '../store'
const getDefaultState = () => {
  return {
    get_gedo_by_index: (index) => {
      return state.documentos_vinculados[index]
    },
    gedo_num: "",
    ee_num: "",
    detalle: {},
    historial: {},
    documentos_vinculados: []
  }
}

const state = getDefaultState()
const getters = (state) => {
  gedo_num: state => gedo_num
  ee_num: state => ee_num
  detalle: state => detalle
  historial: state => historial
  documentos_vinculados: state => documentos_vinculados
}

const mutations = {
  SET_GEDO_NUM: (state, gedo_num) => {
    state.gedo_num = gedo_num
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_EE_NUM: (state, ee_num) => {
    state.ee_num = ee_num
    sessionStorage.setItem('ee', ee_num);
  },

  SET_DETALLE: (state, detalle) => {
    state.detalle = detalle
  },

  SET_HISTORIAL: (state, historial) => {
    state.historial = historial
  },

  SET_DOCUMENTOS_VINCULADOS: (state, documentos_vinculados) => {
    state.documentos_vinculados = documentos_vinculados
  }
}
const actions = {
  async traer_ee({ commit, rootState, dispatch }, ee_num) {

    commit('SET_EE_NUM', 'cargando')
    try {
      var res = await api_ee_historial({ ee: ee_num })
      if (res !== '') {
        console.log("historial", res)
        commit("SET_HISTORIAL", res)
  
        var docs = [...res.documentosVinculados]
  
        docs.sort(function (a, b) {
          if (a.fechavinculacionDefinitiva < b.fechavinculacionDefinitiva) {
            return 1;
          }
          if (a.fechavinculacionDefinitiva > b.fechavinculacionDefinitiva) {
            return -1;
          }
          return 0;
        })
        for (let i = 0; i < docs.length; i++) {
          let doc = docs[i]
          doc.fecha_asociacion = format(doc.fechavinculacionDefinitiva, "yyyy-MM-dd HH:mm:ss")
          doc.orden = docs.length - (i + 1)
          doc.searchable = ((doc.orden + 1).toString() + doc.numeroSadeDocumento + doc.tipodeDocumento + doc.referencia + doc.fecha_asociacion).toUpperCase()
        }
        commit('SET_EE_NUM', ee_num)
        commit("SET_DOCUMENTOS_VINCULADOS", docs)
      } else {
        store.dispatch("app/set_dialog_text", 'No se encontró el expediente')
      }
    } catch (error) { 
      console.log('error',error)
      commit('SET_EE_NUM', '')
      store.dispatch("app/set_error_handler", {header: 'LA PLATAFORMA NO SE ENCUENTRA DISPONIBLE', message:'Estamos trabajando para restablecer el servicio. Por favor, vuelva a ingresar más tarde.',boton: 'expediente'})
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