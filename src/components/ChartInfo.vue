<template>
    <md-content>
        <md-field v-if="currencies" class="currencySelectorField">
            <label for="currencySelector">{{currentCurrency ? currentCurrency.CharCode[0] : 'Выберите валюту'}}</label>
            <md-select id="currencySelector" v-model="selected">
                <div v-for="currency in currencies" v-bind:key="currency.$.ID" @click="() => changeCurrency(currency)">
                    <md-option>
                        {{currency.CharCode[0]}}: {{currency.processedValue}}
                    </md-option>
                </div>
            </md-select>
        </md-field>
        <div style="display: flex">
            <div v-if="dataCollection" class="chart">
                <line-chart :chart-data="dataCollection"></line-chart>
                <button @click="$store.dispatch('chartDataRequest', 'weeks')">wek</button>
                <button @click="$store.dispatch('chartDataRequest', 'months')">month</button>
                <button @click="$store.dispatch('chartDataRequest', 'years')">yer</button>
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
      }
    }
  }
</script>

<style scoped>

</style>