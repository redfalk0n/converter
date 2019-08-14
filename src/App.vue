<template>
    <div class="app">
        <md-dialog-confirm
                v-if="dialogInfo"
                :md-active.sync="dialogInfo.show"
                :md-title="dialogInfo.title"
                :md-content="dialogInfo.description"
                md-confirm-text="Да"
                md-cancel-text="Нет"
                @md-confirm="onConfirm"
        >
        </md-dialog-confirm>
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
            <div class="info-container">
                <div class="flex-div">
                    <div class="table-container">
                        <span class="md-subheading">Таблица изменений курса</span>
                        <DiffTable/>
                    </div>
                    <ChartInfo class="chart-container"/>
                </div>
                <div class="converter-container">
                    <span class="md-subheading">Конвертация по курсу Банка России</span>
                    <Converter/>
                </div>
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
        'setDialogInfo',
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
            this.setDialogInfo({
              title: 'Ошибка',
              description: 'Ошибка запроса данных Банка России. Повторить попытку?',
              show: true,
              source: 'currenciesRequest'
            })
            this.hideLoader()
            console.log(err)
          })
      },
      onConfirm: function() {
        if(this.dialogInfo.source === 'currenciesRequest') {
          this.currenciesRequest()
        } else if(this.dialogInfo.source === 'chartDataRequest') {
          this.$store.dispatch('chartDataRequest', this.dialogInfo.datespan)
        }
      },
    },
    computed: {
      loader() {
        return this.$store.state.loader
      },
      currentCurrency() {
        return this.$store.state.currentCurrency
      },
      dialogInfo() {
        return this.$store.state.dialogInfo
      }
    }
  }
</script>
<style>
    .info-container {
        display: flex;
        justify-content: center;
    }
    .flex-div {
        display: flex;
        border-right: 2px solid #f6f6f6;
    }
    .app-title {
        justify-content: center;
    }
    .main-container {
        width: 75%;
        margin: 0 auto;
        padding: 15px;
    }
    .chart-description {
        font-size: 22px;
    }
    .converter-container {
        width: 315px;
        margin: 20px 0 0 20px;
    }
    .table-container {
        width: 365px;
        margin-top: 20px;
    }
    .chart-container {
        margin-left: 20px;
    }
    .spinner {
        position: fixed;
        right: 20px;
        bottom: 20px;
    }
    @media screen and (max-width: 1500px){
        .main-container {
            width: 90%;
        }
    }
    @media screen and (max-width: 1200px) {
        .main-container {
            width: 95%;
        }
    }
    @media screen and (max-width: 1100px) {
        .flex-div {
            flex-direction: column-reverse;
            align-items: center;
        }
        .chart-container {
            margin-left: 0;
        }
    }
    @media screen and (max-width: 740px) {
        .main-container{
            width: 100%;
        }
        .info-container{
            flex-direction: column-reverse;
            align-items: center;
        }
        .flex-div{
            border: none;
        }
    }
    @media screen and (max-width: 570px) {
        .chart-description {
            font-size: 16px;
        }
    }
</style>
