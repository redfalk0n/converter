<template>
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
</template>

<script>
  export default {
    name: 'DiffTable',
    computed: {
      tableData() {
        return this.$store.state.tableData
      }
    }
  }
</script>

<style scoped>
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