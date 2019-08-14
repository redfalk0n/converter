<template>
    <div>
        <div style="display: flex">
            <md-content>
                <div style="display: flex">
                    <md-field>
                        <label for="firstSelector">{{firstCurrency ? firstCurrency.CharCode[0] : 'Выберите валюту'}}</label>
                        <md-select id="firstSelector" v-model="firstCurrency">
                            <div v-for="currency in currencies" v-bind:key="currency.$.ID" @click="() => setFirstCurrency(currency)">
                                <md-option>
                                    {{currency.CharCode[0]}}: {{currency.processedValue}}
                                </md-option>
                            </div>
                        </md-select>
                    </md-field>
                    <md-field>
                        <label for="firstInput"></label>
                        <md-input id="firstInput" v-model="firstInput" type="number" @input="calculate"></md-input>
                    </md-field>
                </div>
                <i class="material-icons swapBtn" @click="swap">swap_vert</i>
                <div style="display: flex">
                    <md-field>
                        <label for="secondSelector">{{secondCurrency ? secondCurrency.CharCode[0] : 'Выберите валюту'}}</label>
                        <md-select id="secondSelector" v-model="secondCurrency">
                            <div v-for="currency in currencies" v-bind:key="currency.$.ID" @click="() => setSecondCurrency(currency)">
                                <md-option>
                                    {{currency.CharCode[0]}}: {{currency.processedValue}}
                                </md-option>
                            </div>
                        </md-select>
                    </md-field>
                    <md-field>
                        <label for="secondInput"></label>
                        <md-input id="secondInput" v-model="secondInput" readonly></md-input>
                    </md-field>
                </div>
            </md-content>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Converter',
    data: () => {
      return {
        firstCurrency: null,
        firstInput: 100,
        secondCurrency: null,
        secondInput: null,
      }
    },
    methods: {
      setFirstCurrency: function(curr) {
        this.firstCurrency = curr
      },
      setSecondCurrency: function(curr) {
        this.secondCurrency = curr
        this.calculate()
      },
      calculate: function() {
        this.secondInput = ((Number(this.firstCurrency.processedValue) * Number(this.firstInput))
          / Number(this.secondCurrency.processedValue)).toFixed(4)
      },
      swap: function() {
        let temp = this.firstCurrency
        this.firstCurrency = this.secondCurrency
        this.secondCurrency = temp
        temp = this.firstInput
        this.firstInput = this.secondInput
        this.secondInput = temp
      }
    },
    computed: {
      currencies() {
        return this.$store.state.currencies
      },
    }
  }
</script>
<style>
    .swapBtn {
        cursor: pointer;
    }
</style>
