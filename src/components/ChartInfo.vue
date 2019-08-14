<template>
    <md-content>
        <md-field v-if="currencies" class="currencySelectorField">
            <label for="currencySelector">{{currentCurrency ? currentCurrency.CharCode[0] : 'Выберите валюту'}}</label>
            <md-select id="currencySelector" v-model="selected" md-dense>
                <div v-for="currency in currencies" v-bind:key="currency.$.ID" @click="() => changeCurrency(currency)">
                    <md-option>
                        {{currency.CharCode[0]}} ({{currency.Name[0]}})
                    </md-option>
                </div>
            </md-select>
        </md-field>
        <div style="display: flex">
            <div v-if="dataCollection" class="chart">
                <line-chart :chart-data="dataCollection" :options="options"></line-chart>
                <div class="button-container">
                    <md-button class="md-accent md-raised" @click="$store.dispatch('chartDataRequest', 'weeks')">Неделя</md-button>
                    <md-button class="md-accent md-raised" @click="$store.dispatch('chartDataRequest', 'months')">Месяц</md-button>
                    <md-button class="md-accent md-raised" @click="$store.dispatch('chartDataRequest', 'quarter')">Квартал</md-button>
                    <md-button class="md-accent md-raised" @click="$store.dispatch('chartDataRequest', 'years')">Год</md-button>
                </div>
            </div>
        </div>
    </md-content>
</template>

<script>

  import { mapMutations } from 'vuex'

  import LineChart from './LineChart'

  export default {
    name: 'ChartInfo',
    components: {
      LineChart
    },
    data: () => {
      return {
        selected: null,
      }
    },
    methods: {
      ...mapMutations([
        'setCurrentCurrency',
      ]),
      changeCurrency: function(curr) {
        this.setCurrentCurrency(curr)
        console.log(curr)
        this.$store.dispatch('chartDataRequest')
      },
    },
    computed: {
      currencies() {
        return this.$store.state.currencies
      },
      currentCurrency() {
        return this.$store.state.currentCurrency
      },
      dataCollection() {
        return this.$store.state.dataCollection
      },
      options() {
        return {
          legend: {
            display: false,
          },
          title: {
            display: true,
              text: this.$store.state.dataCollection.datasets[0].label
          }
        }
      }
    }
  }
</script>

<style scoped>
    .md-menu-content-container {
        height: 230px;
        min-width: fit-content;
    }
    .md-button.md-theme-default.md-raised:not([disabled]).md-accent{
        background-color: #ef472b;
        min-width: 65px;
        font-size: 12px;
        height: 30px;
    }
    .button-container{
        display: flex;
        justify-content: center;
    }
</style>