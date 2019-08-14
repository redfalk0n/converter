<template>
    <div class="app">
        <md-toolbar class="app-title">
            <h2 class="thumb">Конвертер валют</h2>
        </md-toolbar>
        <md-content class="main-container">
            <span class="md-display-1 chart-description" v-if="currentCurrency">Динамика курса{{
                    Number(currentCurrency.Nominal[0]) > 1
                    ? ` ${currentCurrency.Name[0].toLocaleLowerCase()}`
                    : `: ${currentCurrency.Name[0].toLocaleLowerCase()}`}} к рублю
            </span>
            <md-divider/>
            <div class="flex-div">
                <div>
                    <div class="converter-container">
                        <span class="md-subheading">Конвертер валют по курсу Банка России</span>
                        <Converter/>
                    </div>
                    <md-divider/>
                    <div class="table-container">
                        <span class="md-subheading">Таблица изменений курса</span>
                        <DiffTable/>
                    </div>
                </div>
                <ChartInfo class="chart-container"/>
            </div>
        </md-content>
        <md-progress-spinner v-if="loader" class="md-accent spinner" md-mode="indeterminate"></md-progress-spinner>
    </div>
</template>

<script>
  import axios from 'axios'
  import xml2js from 'xml2js'
  import moment from 'moment'
  import { mapMutations } from 'vuex'

  import { PROXY } from './constants'

  import Converter from './components/Converter'
  import DiffTable from './components/DiffTable'
  import ChartInfo from './components/ChartInfo'

  export default {
    name: 'App',
    components: {
      Converter,
      DiffTable,
      ChartInfo,
    },
    created: function () {
      this.currenciesRequest()
    },
    methods: {
      ...mapMutations([
        'showLoader',
        'hideLoader',
        'setCurrencies',
        'setDataCollection',
        'setCurrentCurrency',
      ]),
      currenciesRequest: function () {
        this.showLoader()
        const reqOptions = {
          method: 'get',
          url: `${PROXY}http://www.cbr.ru/scripts/XML_daily.asp?date_req=${moment(new Date()).format('DD/MM/YYYY')}`,
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
                const data = res.ValCurs.Valute.map((item) => {
                  return {
                    ...item,
                    processedValue: (parseFloat(item.Value[0].replace(',', '.'))/
                      parseFloat(item.Nominal[0].replace(',', '.'))).toPrecision(4)
                  }
                })
                this.setCurrencies(data)
                this.setCurrentCurrency(data[0])
                this.$store.dispatch('chartDataRequest')
              }
            })
            this.hideLoader()
          })
          .catch((err) => {
            this.hideLoader()
            console.log(err)
          })
      },
    },
    computed: {
      loader() {
        return this.$store.state.loader
      },
      currentCurrency() {
        return this.$store.state.currentCurrency
      },
    }
  }
</script>
<style>
    .flex-div {
        display: flex;
    }
    .app {
        background: white;
    }
    .app-title {
        justify-content: center;
    }
    .main-container {
        width: 53%;
        margin: 0 auto;
    }
    .chart-description {
        font-size: 22px;
    }
    .converter-container {
        width: 315px;
        margin: 20px 0;
    }
    .table-container {
        width: 365px;
        margin: 20px 0;
    }
    .chart-container {
        margin-left: 40px;
    }
    .spinner {
        position: fixed;
        right: 20px;
        bottom: 20px;
    }
</style>
