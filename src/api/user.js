import request from "../helpers/request"
import store from "../store/store"

export function login(data) {

  return request({
    url: '/gde-security/security/auth',
    method: 'post',
    data
  })
}

export function renewAccessToken() {

  return request({
    url: '/gde-security/security/auth/renew',
    method: 'get',
    headers: {
      authorization: "Bearer " + store.state.user.tokens.refreshToken
    },
  })
}


export function logout(data) {
  return request({
    url: '/gde-security/security/auth/revoke',
    method: 'delete',
    headers: {
      authorization: "Bearer " + store.state.user.tokens.accessToken
    },
    data
  })
}

