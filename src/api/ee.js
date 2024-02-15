import request from "../helpers/request"
import store from "../store/store"

export function ee_detalle(params) {

  //console.log(params)
  return request({
    url: '/gde-restfull-api-web/Expediente/detalle',
    method: 'get',
    headers: {
      authorization: "Bearer " + store.state.user.tokens.accessToken
    },
    params
  })
}


export function ee_zip(params) {
  params.sistemaOrigen = import.meta.env.VITE_APP_SISTEMA_ORIGEN

  //console.log(params)
  return request({
    url: '/gde-restfull-api-web/Expediente/obtenerZipConDocumentos',
    method: 'get',
    headers: {
      authorization: "Bearer " + store.state.user.tokens.accessToken
    },
    params
    },
    8*60*60*1000
  )
}



export function ee_historial(params) {
  return request({
    url: '/gde-restfull-api-web/Expediente/historial',
    method: 'get',
    headers: {
      authorization: "Bearer " + store.state.user.tokens.accessToken
    },
    params
  })
}

export function ee_gedo_detalle(params) {
  params.sistemaOrigen = import.meta.env.VITE_APP_SISTEMA_ORIGEN

  return request({
    url: '/gde-restfull-api-web/Expediente/documento/detalle',
    method: 'get',
    headers: {
      authorization: "Bearer " + store.state.user.tokens.accessToken
    },
    params
  })
}
