<template>
    <div>
        <div style="display: flex">
            <md-content>
                <div>
                    <md-field>
                        <md-select id="currencySelector" v-model="selected">
                            <div v-for="currency in currencies" v-bind:key="currency.$.ID">
                                <md-option>
                                    {{currency.CharCode[0]}}: {{currency.processedValue}}
                                </md-option>
                            </div>
                        </md-select>
                    </md-field>
                    <md-field>
                        <md-select id="currencySelector" v-model="selected2">
                            <div v-for="currency in currencies" v-bind:key="currency.$.ID">
                                <md-option>
                                    {{currency.CharCode[0]}}: {{currency.processedValue}}
                                </md-option>
                            </div>
                        </md-select>
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
        selected: null,
        selected2: null,
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
