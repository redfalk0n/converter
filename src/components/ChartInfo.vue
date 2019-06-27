<template>
    <md-content>
        <md-field class="currencySelectorField">
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
            <div v-if='datacollection' class="chart">
                <line-chart :chart-data="datacollection"></line-chart>

                <button @click="chartDataRequest('weeks')">wek</button>
                <button @click="chartDataRequest('months')">month</button>
                <button @click="chartDataRequest('years')">yer</button>

            </div>
            <md-table class="curChanges">
                <md-table-row>
                    <md-table-head>Дата</md-table-head>
                    <md-table-head>Курс</md-table-head>
                    <md-table-head>+/-</md-table-head>
                </md-table-row>

                <md-table-row v-for="(data, index) in tableData.slice().reverse()" v-bind:key="index">
                    <md-table-cell>{{data.date}}</md-table-cell>
                    <md-table-cell>{{data.curs}}</md-table-cell>
                    <md-table-cell>
                        <p v-if="!data.cursChange">-</p>
                        <div class="plusCost" v-else-if="data.cursChange > 0">
                            <p>{{`+${data.cursChange}`}}</p>
                            <i class="material-icons">arrow_drop_up</i>
                        </div>
                        <div class="minusCost" v-else>
                            <p>{{data.cursChange}}</p>
                            <i class="material-icons">arrow_drop_down</i>
                        </div>
                    </md-table-cell>
                </md-table-row>
            </md-table>
        </div>
    </md-content>
</template>

<script>
  export default {
    name: 'ChartInfo'
  }
</script>

<style scoped>

</style>