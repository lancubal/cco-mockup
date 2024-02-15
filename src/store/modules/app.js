
const getDefaultState = () => {
  return {

    dialog_text: null,
    error_handler: null,
    gedos_isCollapsed: false,
    detalleGedo_isCollapsed: false
  }
}

const state = getDefaultState()
const getters = (state) => {
  dialog_text: state => dialog_text
  error_handler: state => error_handler
  gedos_isCollapsed: state => gedos_isCollapsed
  detalleGedo_isCollapsed: state => detalleGedo_isCollapsed
}

const mutations = {

  SET_DIALOG_TEXT: (state, text) => {
    if(text != 'Token Inválido')
      state.dialog_text = text
  },
  SET_ERROR_HANDLER: (state, err) => {
    state.error_handler = err
  },
  SET_GEDOS_COLLAPSED: (state, value) => {
    state.gedos_isCollapsed = value
  },
  SET_DETALLEGEDO_COLLAPSED: (state, value) => {
    state.detalleGedo_isCollapsed = value
  }
}
const actions = {
  set_dialog_text(context, texto) {
    context.commit("SET_DIALOG_TEXT", texto)
  },

  set_error_handler(context,err) {
    context.commit("SET_ERROR_HANDLER",err)
  },

  toggleGedos_isCollapsed(context) {
    context.commit("SET_GEDOS_COLLAPSED", !context.state.gedos_isCollapsed)
  },

  toggleDetalleGedo_isCollapsed(context) {
    context.commit("SET_DETALLEGEDO_COLLAPSED", !context.state.detalleGedo_isCollapsed)
  },

  setDetalleGedo_isCollapsed_not(context) {
    context.commit("SET_DETALLEGEDO_COLLAPSED", false)
  }

}



export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}