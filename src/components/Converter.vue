<template>
    <div>
        <div class="flex-container">
            <md-content class="selectors-container">
                <div class="flex-container">
                    <md-field>
                        <label for="firstSelector" class="select-label">
                            {{firstCurrency ? firstCurrency.CharCode[0] : 'Валюта'}}
                        </label>
                        <md-select id="firstSelector" class="currSelector" v-model="selected" md-dense>
                            <div v-for="currency in currencies"
                                 v-bind:key="currency.$.ID"
                                 @click="() => setFirstCurrency(currency)"
                            >
                                <md-option>
                                    {{currency.CharCode[0]}} ({{currency.Name[0]}})
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
                <div class="flex-container">
                    <md-field>
                        <label for="secondSelector" class="select-label">
                            {{secondCurrency ? secondCurrency.CharCode[0] : 'Валюта'}}
                        </label>
                        <md-select id="secondSelector" v-model="selected" class="currSelector" md-dense>
                            <div v-for="currency in currencies"
                                 v-bind:key="currency.$.ID"
                                 @click="() => setSecondCurrency(currency)"
                            >
                                <md-option>
                                    {{currency.CharCode[0]}} ({{currency.Name[0]}})
                                </md-option>
                            </div>
                        </md-select>
                    </md-field>
                    <md-field>
                        <label for="secondInput"></label>
                        <md-input id="secondInput" v-model="secondInput" readonly></md-input>
                    </md-field>
                </div>
                <md-field>
                    <label for="roundSelector">Десятичная точность</label>
                    <md-select id="roundSelector" v-model="roundNumber">
                        <div v-for="number in Array(11).keys()" v-bind:key="number" @click="() => calculate()">
                            <md-option :value="number">
                                {{number}}
                            </md-option>
                        </div>
                    </md-select>
                </md-field>
                <md-switch v-model="format" @change="() => calculate()">Форматирование</md-switch>
            </md-content>
        </div>
    </div>
</template>

<script>
  import format from 'format-number'

  export default {
    name: 'Converter',
    data: () => {
      return {
        selected: null,
        firstCurrency: null,
        firstInput: 100,
        secondCurrency: null,
        secondInput: null,
        roundNumber: 2,
        format: true,
      }
    },
    methods: {
      setFirstCurrency: function (curr) {
        this.firstCurrency = curr
        this.calculate()
      },
      setSecondCurrency: function (curr) {
        this.secondCurrency = curr
        this.calculate()
      },
      calculate: function () {
        if(this.firstCurrency && this.firstInput && this.secondCurrency) {
          const processedValue = Math.round(((Number(this.firstCurrency.processedValue) * Number(this.firstInput))
            / Number(this.secondCurrency.processedValue)) * Number(1 + '0'.repeat(this.roundNumber)))
            / Number(1 + '0'.repeat(this.roundNumber))
          if(this.format) {
            this.secondInput = format({integerSeparator: ' ', decimal: ','})(processedValue)
          } else {
            this.secondInput = processedValue
          }
        }
      },
      swap: function () {
        let temp = this.firstCurrency
        this.firstCurrency = this.secondCurrency
        this.secondCurrency = temp
        temp = this.firstInput
        this.firstInput = this.secondInput.replace(',', '.').split(' ').join('')
        if(this.format) {
          this.secondInput = format({integerSeparator: ' ', decimal: ','})(temp)
        } else {
          this.secondInput = temp
        }
      }
    },
    computed: {
      currencies() {
        const rub = {
          CharCode: ['RUB'],
          Name: ['Российский рубль'],
          $: [{ID: 'R91010'}],
          processedValue: '1',
        }
        const newCurrencies = [...this.$store.state.currencies]
        newCurrencies.unshift(rub)
        return newCurrencies
      },
    }
  }
</script>
<style>
    .swapBtn {
        cursor: pointer;
        border-radius: 5px;
    }

    .swapBtn:hover {
        background: #e6e2e2;
    }

    .md-menu-content-container {
        height: 230px;
        min-width: fit-content;
    }

    .currSelector {
        width: 90px;
    }

    .selectors-container {
        width: 200px;
    }

    .flex-container {
        display: flex;
    }
</style>
