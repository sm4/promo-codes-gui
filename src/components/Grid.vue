<template>
  <div>
    <div class="row">
      <div class="search">
        <span class="fa fa-search"></span>
        <input class="u-full-width" type="text" placeholder="Search..." id="filterBox" v-on:input="updateFilterKey">
      </div>
    </div>
    <table class="u-full-width">
      <thead>
      <th class="control"><input type="checkbox" id="selectAll" v-model="selectAll"></th>
      <th v-for="columnDefinition in columns"
          @click="sortBy(columnDefinition.key)"
          :class="{ active: sortKey == columnDefinition.key }">
        {{ columnDefinition.name }}
        <span v-if="sortKey == columnDefinition.key"
              :class="sortOrders[columnDefinition.key] > 0 ? 'fa fa-caret-up' : 'fa fa-caret-down'"></span>
      </th>
      <th class="control"/>
      <th class="control"/>
      </thead>
      <tbody>
      <tr v-for="entry in filteredData">
        <td><input type="checkbox" v-model="entry.selected"></td>
        <td v-for="columnDefinition in columns">
          <span v-html="dynamicFilter(entry[columnDefinition.key], columnDefinition.filter)"></span>
        </td>
        <td>
          <span class="fa fa-pencil-square-o" aria-hidden="true" @click="editCallback(entry)"></span>
        </td>
        <td>
          <span class="fa fa-trash-o" aria-hidden="true" @click="deleteCallback(entry)"></span>
        </td>
      </tr>
      </tbody>
      <tfoot v-if="data.length > limit">
      <tr>
        <th :colspan="columns.length + 3" class="centered">
          <button @click="limit += 10">Show more</button>
          <button @click="limit = data.length">Show all</button>
        </th>
      </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
  import _ from 'lodash'
  import moment from 'moment'

  export default {
    props: {
      data: Array,
      columns: Array,
      initialSortKey: String,
      editCallback: Function,
      deleteCallback: Function
    },
    data: function () {
      var sortOrders = {}
      this.columns.forEach(function (columnDefinition) {
        sortOrders[columnDefinition.key] = 1
      })
      return {
        filterKey: '',
        debouncedFilterKey: '',
        limit: 10,
        sortKey: this.initialSortKey,
        sortOrders: sortOrders
      }
    },
    computed: {
      filteredData: function () {
        var sortKey = this.sortKey
        var filterKey = this.filterKey && this.filterKey.toLowerCase()
        var order = this.sortOrders[sortKey] || 1
        var data = this.data
        if (filterKey) {
          data = data.filter(function (row) {
            return Object.keys(row).some(function (key) {
              return String(row[key]).toLowerCase().indexOf(filterKey) > -1
            })
          })
        }
        if (sortKey) {
          data = data.slice().sort(function (a, b) {
            a = a[sortKey]
            b = b[sortKey]
            return (a === b ? 0 : a > b ? 1 : -1) * order
          })
        }
        return data.slice(0, this.limit)
      },
      selectAll: {
        get: function () {
          var allSelected = this.filteredData.length > 0
          this.filteredData.forEach(function (item) {
            allSelected &= item.selected
          })
          return allSelected
        },
        set: function (value) {
          this.filteredData.forEach(function (item) {
            item.selected = value
          })
        }
      }
    },
    methods: {
      sortBy: function (key) {
        this.sortKey = key
        this.sortOrders[key] = this.sortOrders[key] * -1
      },
      dynamicFilter: function (str, filterName) {
        if (filterName === 'localDate') {
          return moment(new Date(str)).format('YYYY-MM-DD')
        } else if (filterName === 'boolean') {
          return str ? 'Yes' : 'No'
        } else {
          return str
        }
      },
      setFilterKey: function (event) {
        this.filterKey = event.target.value
      },
      updateFilterKey: _.debounce(function (event) {
        this.setFilterKey(event)
      }, process.env.DEFAULT_DEBOUNCE),
      rowClick: function (entry) {
        console.log('Entry ' + JSON.stringify(this.filteredData[entry]))
        this.filteredData[entry].checked = true
      }
    }
  }
</script>

<style scoped>
  .search {
    position: relative;
  }

  .search input {
    text-indent: 30px;
  }

  .search .fa-search {
    position: absolute;
    top: 10px;
    left: 7px;
  }

  td, th {
    cursor: pointer;
  }
</style>
