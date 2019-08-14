import Vue from 'vue'
import Vuex from 'vuex'
import VueMaterial from 'vue-material'
import axios from 'axios'
import xml2js from 'xml2js'
import moment from 'moment'

import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
import App from './App.vue'
import { PROXY } from './constants'

Vue.use(Vuex)
Vue.use(VueMaterial)
Vue.config.productionTip = false

export const store = new Vuex.Store({
  state: {
    currencies: [],
    loader: false,
    dataCollection: null,
    currentCurrency: null,
    tableData: [],
  },
  mutations: {
    setCurrencies(state, value) {
      state.currencies = value
    },
    setDataCollection(state, value) {
      state.dataCollection = value
    },
    setCurrentCurrency(state, value) {
      state.currentCurrency = value
    },
    setTableData(state, value) {
      state.tableData = value
    },
    showLoader(state) {
      state.loader = true
    },
    hideLoader(state) {
      state.loader = false
    },
  },
  actions: {
    chartDataRequest(context, dateSpan = 'weeks'){
      context.commit('showLoader')
      const reqOptions = {
        method: 'get',
        url: `${PROXY}http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${moment(new Date()).subtract(dateSpan, 1).format('DD/MM/YYYY')}&date_req2=${moment(new Date()).format('DD/MM/YYYY')}&VAL_NM_RQ=${context.state.currentCurrency.$.ID}`,
        headers: {
          'Content-Type': 'application/xml',
        },
      }
      axios(reqOptions)
        .then((resp) => {
          xml2js.parseString(resp.data, (err, res) => {
            if (err) {
              console.log('ERROR: ', err)
            } else {
              const dataCollection = {
                labels: res.ValCurs.Record.map(item => item.$.Date),
                datasets: [
                  {
                    label: context.state.currentCurrency.Name[0],
                    backgroundColor: 'red',
                    data: res.ValCurs.Record.map(item => (parseFloat(item.Value[0].replace(',', '.'))/
                      parseFloat(item.Nominal[0].replace(',', '.'))).toPrecision(4))
                  }
                ]
              }
              const curInfo = dataCollection.datasets[0].data
              const tableData = []
              res.ValCurs.Record.forEach((item, index) => {
                tableData.push({
                  cursChange: index === 0 ? '' : (curInfo[index] - curInfo[index - 1]).toPrecision(2),
                  date: item.$.Date,
                  curs: curInfo[index],
                })
              })
              if (dateSpan === 'years' || dateSpan === 'quarter') dataCollection.datasets[0].pointRadius = 0
              context.commit('setTableData', tableData)
              context.commit('setDataCollection', dataCollection)
            }
          })
          context.commit('hideLoader')
        })
        .catch((err) => {
          context.commit('hideLoader')
          console.log(err)
        })
    },
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
