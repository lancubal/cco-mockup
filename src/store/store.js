import { createStore } from 'vuex'

import ee from "./modules/ee"
import gedo from "./modules/gedo"
import user from './modules/user'
import app from "./modules/app"


export default createStore({
  modules: {
    app,
    user,
    ee,
    gedo

  },
})


