<template>
    <div class="app">
        <md-toolbar>
            <h2 class="thumb">Конвертер валют</h2>
        </md-toolbar>
        <div style="display: flex">
            <ChartInfo/>
            <DiffTable/>
            <Converter/>
        </div>
        <md-progress-spinner v-if="loader" class="md-accent" md-mode="indeterminate"></md-progress-spinner>
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
                console.log('DATA', data)
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
      }
    }
  }
</script>
<style>
    /*.md-list-item-text {
        cursor: pointer;
    }
    .material-icons {
        align-self: center;
    }
    .plusCost {
        display: flex;
        color: green;
    }
    .minusCost {
        display: flex;
        color: red;
    }
    .curChanges {
        max-height: 500px;
        overflow: auto;
    }*/
</style>
