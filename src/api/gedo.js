import request from "../helpers/request"
import store from "../store/store"




export function gedo_detalle(params) {
  params.sistemaOrigen = import.meta.env.VITE_APP_SISTEMA_ORIGEN
  //console.log(params)
  return request({
    url: '/gde-restfull-api-web/api/v1/documento/detalle',
    method: 'get',
    headers: {
      authorization: "Bearer " + store.state.user.tokens.accessToken
    },
    params
  })
}


export function archivoTrabajo(params) {

  //console.log(params)
  return request({
    url: '/gde-restfull-api-web/api/v2/archivo-trabajo',
    method: 'get',
    headers: {
      authorization: "Bearer " + store.state.user.tokens.accessToken
    },
    params
  })
}

export function gedo_pdf(params) {
  params.sistemaOrigen = import.meta.env.VITE_APP_SISTEMA_ORIGEN

  return request({
    url: '/gde-restfull-api-web/api/v1/documento/pdf',
    method: 'get',
    headers: {
      authorization: "Bearer " + store.state.user.tokens.accessToken
    },
    params
  })
}
