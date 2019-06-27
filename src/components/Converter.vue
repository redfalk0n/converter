<template>
    <div class="app">
        <md-toolbar>
            <h2 class="thumb">Конвертер валют</h2>
        </md-toolbar>
        <div style="display: flex">
            <md-content>
                <div>
                    <div style="display: flex">
                        <input type="text" placeholder="Cur"/>
                        <md-select v-model="currencies"/>
                    </div>
                    <button />
                    <div style="display: flex">
                        <input type="text" placeholder="Conv">
                        <md-select/>
                    </div>
                </div>
            </md-content>
        </div>
        <md-progress-spinner v-if="loader" class="md-accent" md-mode="indeterminate"></md-progress-spinner>
    </div>
</template>

<script>
  import axios from 'axios'
  import xml2js from 'xml2js'
  import moment from 'moment'

  import LineChart from './LineChart'

  const proxy = 'https://yacdn.org/proxy/'

  export default {
    name: 'Converter',
    components: {
      LineChart
    },
    created: function () {
      this.currenciesRequest()
    },
    data: () => {
      return {
        currencies: [],
        loader: false,
        selectedDate: null,
        datacollection: null,
        currentCurrency: null,
        selected: null,
        tableData: [],
      }
    },
    methods: {
      check: function () {
        alert('check')
      },
      changeCurrency: function (curr) {
        this.loader = true
        this.currentCurrency = curr
        console.log(curr)
        this.chartDataRequest()
      },
      currenciesRequest: function () {
        this.loader = true
        const reqOptions = {
          method: 'get',
          url: `${proxy}http://www.cbr.ru/scripts/XML_daily.asp?date_req=${moment(new Date()).format('DD/MM/YYYY')}`,
          headers: {
            'Content-Type': 'application/xml',
          },
        }
        axios(reqOptions)
          .then((resp) => {
            this.loader = false
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
                this.currencies = data
                this.$store.commit('setCurrencies', data)
                 if (!this.currentCurrency)
                 {
                   this.currentCurrency = data[0]
                   this.chartDataRequest()
                 }
                console.log('DATA', data)
              }
            })
          })
          .catch((err) => {
            this.loader = false
            console.log(err)
          })
      },
      chartDataRequest: function (dateSpan = 'weeks') {
        this.loader = true
        const reqOptions = {
          method: 'get',
          url: `${proxy}http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${moment(new Date()).subtract(dateSpan, 1).format('DD/MM/YYYY')}&date_req2=${moment(new Date()).format('DD/MM/YYYY')}&VAL_NM_RQ=${this.currentCurrency.$.ID}`,
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
                this.datacollection = {
                  labels: res.ValCurs.Record.map(item => item.$.Date),
                  datasets: [
                    {
                      label: this.currentCurrency.Name[0],
                      backgroundColor: 'red',
                      data: res.ValCurs.Record.map(item => (parseFloat(item.Value[0].replace(',', '.'))/
                        parseFloat(item.Nominal[0].replace(',', '.'))).toPrecision(4))
                    }
                  ]
                }
                if (dateSpan === 'years') this.datacollection.datasets[0].pointRadius = 0
                const curInfo = this.datacollection.datasets[0].data
                this.tableData = []
                res.ValCurs.Record.forEach((item, index) => {
                  this.tableData.push({
                    cursChange: index === 0 ? '' : (curInfo[index] - curInfo[index - 1]).toPrecision(2),
                    date: item.$.Date,
                    curs: curInfo[index],
                  })
                })
              }
            })
            this.loader = false
          })
          .catch((err) => {
            this.loader = false
            console.log(err)
          })
      },
    },
    computed: {
      currencies() {
        return this.$store.state.currencies
      }
    }
  }
</script>
<style>
    .md-list-item-text {
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
    }
</style>
