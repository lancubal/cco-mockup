import { ee_gedo_detalle as api_ee_gedo_detalle } from "../../api/ee.js"
import format from "date-fns/format"
import error_translation_rules from "../../helpers/error_translation_rules"
import axios from "axios"
const getDefaultState = () => {
  return {
    curr_gedo: {},
    gedo_num: "",
    detalle: {},
    pdf: "",
    trayendo_gedo: true,
    documento: null,
  }
}
let cache_detalle = {}
let cache_pdf = {}

const state = getDefaultState()
const getters = (state) => {

  curr_gedo: state => curr_gedo
  gedo_num: state => gedo_num
  detalle: state => detalle
  pdf: state => pdf
  trayendo_gedo: state => trayendo_gedo
  documento: state => documento

}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
    cache_detalle = {}
  },
  SET_GEDO_NUM: (state, gedo_num) => {
    state.gedo_num = gedo_num
  },
  SET_DETALLE: (state, detalle) => {
    state.detalle = detalle
  },
  SET_PDF: (state, pdf) => {
    state.pdf = pdf
  },
  SET_CURR_GEDO_VINCULADO: (state, gedo) => {
    state.curr_gedo = gedo
  },
  SET_TRAYENDO_GEDO: (state, trayendo_gedo) => {
    state.trayendo_gedo = trayendo_gedo
  },
  SET_DOCUMENTO(state,documento){
    state.documento = documento
  }

}
const actions = {
  set_curr_gedo_vinculado({ commit, rooState }, gedo) {
    commit("SET_CURR_GEDO_VINCULADO", gedo)
  },
  async traer_detalle({ commit, rootState }, params) {
    if (!cache_detalle[params.documento]) {
      try {
          cache_detalle[params.documento] = await api_ee_gedo_detalle({ documento: params.documento, ee: params.ee }, rootState.user.tokens.accessToken)
      } catch (error) {
        //console.log("catch error detalle", error)
        cache_detalle[params.documento] = {}
        cache_detalle[params.documento].contentPdf = cache_pdf.error
        cache_detalle[params.documento].error = true
      }
      cache_detalle[params.documento].puedeVerDocumento = cache_detalle[params.documento].contentPdf != null
      if (!cache_detalle[params.documento].puedeVerDocumento && rootState.user.tokenValido)
        cache_detalle[params.documento].contentPdf = cache_pdf.reservado
    }
    //console.log("detalle GEDO", cache_detalle[gedo_num])
    commit("SET_DETALLE", cache_detalle[params.documento])
    commit("SET_PDF", cache_detalle[params.documento].contentPdf)
  },
  async traer_pdf_subsanado({ commit, rootState }) {
    commit("SET_PDF", cache_pdf.subsanado)
  }

}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

let traer_pdf_local = async function (nombre) {
  let response = await axios.get(nombre, { responseType: "arraybuffer" })

  const binaryString = Array.from(new Uint8Array(response.data), v => String.fromCharCode(v)).join("");
  var pdf = btoa(binaryString)
  return pdf
}

let init = async function() {
  cache_pdf.reservado = await traer_pdf_local('/PDFreservado.pdf')
  cache_pdf.subsanado = await traer_pdf_local('/PDFsubsanado.pdf')
  cache_pdf.error = await traer_pdf_local('/PDFerror.pdf')
}

init()
