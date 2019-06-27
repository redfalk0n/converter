import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'

Vue.use(Vuex)
Vue.use(VueMaterial)
Vue.config.productionTip = false

export const store = new Vuex.Store({
  state: {
    currencies: [],
  },
  mutations: {
    setCurrencies (state, value) {
      state.currencies = value
    }
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
