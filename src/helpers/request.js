import axios from 'axios'


import store from "../store/store"

var loadingInstance;
// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_SERVICE_URL, // url = base url + request url
  //withCredentials: true, // send cookies when cross-domain requests
  timeout: 32000 // request timeout
})

// request interceptor
service.interceptors.request.use(

  config => {
    //loadingInstance = Loading.service();

    return config
  },
  error => {

    //console.log("request err", error) // for debug

    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  response => {
    //loadingInstance.close()

    //console.log(response.config.url, "metricas: bus:", response.headers["metricas-bus-elapsed"], "servicio:", response.headers["metricas-servicio-elapsed"])
    //console.log("accessTokenRestante", response.headers["access-token-restante"])

    const res = response.data
    if (res.error == true) {
      store.dispatch("app/set_dialog_text", res.errorResponse.codeDescription)

    }
    //console.log("resdata", res)

    return res

  },
  error => {

    //console.log(JSON.stringify(error)) // for d{ebug
    if (error) {
      //console.log("err response", error.response)

      if (error.response && error.response?.status) {
        switch (error.response.status) {
          case 405:
          case 401:
            store.dispatch("user/setTokenValido", false)
            break;
          case 403:
          case 500:
          case 415:
          case 503:
            break
          default:
            store.dispatch("app/set_dialog_text", error.response.data.message)

            break;
        }

        let data = error.response["data"]
        if (data) {
          return Promise.reject(error.response.data)

        }
      } else if (error.code == "ECONNABORTED") {

        store.dispatch("app/set_dialog_text", "Error conectando con el servidor")

      }
    }

    return Promise.reject(error)


  }
)

export default (params, timeout = (8*60*60*1000)) => {
    service.defaults.timeout = timeout
    return service(params)
}
