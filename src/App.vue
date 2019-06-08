<template>
    <div id="app">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
        <md-button @click="click">request</md-button>
        <md-list v-for="currency in currencies" v-bind:key="currency.$.ID">
            <md-list-item>
                <md-icon>delete</md-icon>
                <span class="md-list-item-text">
                    {{currency.Name[0]}}:
                    {{(parseFloat(currency.Value[0].replace(',', '.'))/
                    parseFloat(currency.Nominal[0].replace(',', '.'))).toPrecision(4)}}
                </span>
            </md-list-item>
        </md-list>
        <md-datepicker v-model="selectedDate" />
    </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue'
  import axios from 'axios'
  import xml2js from 'xml2js'
  import moment from 'moment'
  import 'vue-material/dist/vue-material.css'

  export default {
    name: 'app',
    components: {
      HelloWorld
    },
    data: () => {
      return {
        currencies: []
      }
    },
    methods: {
      click: function () {
        const reqOptions = {
          method: 'get',
          url: `https://cors.io/?http://www.cbr.ru/scripts/XML_daily.asp?date_req=${moment(new Date()).format("DD/MM/YYYY")}`,
          headers: {
            'Content-Type': 'application/xml',
          },
        }
        axios(reqOptions)
          .then((resp) => {
            xml2js.parseString(resp.data, {trim: true}, (err, res) => {
              if (err) {
                console.log('ERROR: ', err)
              }  else {
                this.currencies = res.ValCurs.Valute
                console.log(res)
              }
            })
          })
          .catch((err) => {
            console.log(err)
          })
      },
    }
  }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
