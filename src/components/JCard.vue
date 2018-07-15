<template>
  <v-container>

    <v-card>
      <v-list three-line>
        <template v-for="(item, index) in items">
          <v-divider v-if="index !== 0"></v-divider>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>{{ item[0] }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item[1] || 'None' }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>

      <v-card-actions v-show="actions">
        <j-date-picker v-model="date1"></j-date-picker>
        <j-date-picker v-model="date2"></j-date-picker>

        <v-spacer></v-spacer>
        <v-btn flat @click="clickedHistory">
          <v-icon right left>history</v-icon>
        </v-btn>
        <v-btn flat @click="clickedEdit" append>
          <v-icon right left>edit</v-icon>
        </v-btn>
        <v-btn flat @click="clickedDelete">
          <v-icon right left>delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-navigation-drawer
      v-model="showHistory"
      clipped
      fixed
      app
      right
    >
      <v-list two-line>
        <v-subheader>Version History</v-subheader>
        <template v-for="(patch, index) in patches">
          <v-list-tile ripple :key="index" class="tile" @click="">

            <v-list-tile-content>
              <v-list-tile-title>{{ opLabelMap[patch.op] }} {{ processKey(patch.path) }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ patch.value || 'None' }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-list-tile-action-text>{{ patch.time }}</v-list-tile-action-text>
              <v-list-tile-action-text></v-list-tile-action-text>
            </v-list-tile-action>

          </v-list-tile>
          <v-divider v-if="index + 1 < patch.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>

  </v-container>
</template>

<script>
  import JDatePicker from '@/components/inputs/JDatePicker'
  import { router } from '@/router'

  export default {
    name: 'JCard',
    props: {
      computeItems: {required: true, type: Function},
      item: {required: true, type: Object},
      object: String,
      actions: {type: Boolean, default: false}
    },
    components: {JDatePicker},
    data () {
      return {
        showHistory: false,
        date1: null,
        date2: null,
        opLabelMap: {add: 'Added', remove: 'Removed', replace: 'Changed'}
      }
    },
    computed: {
      items () {
        if (this.itemAtDate) {
          return this.computeItems(this.itemAtDate)
        } else {
          return this.computeItems(this.item)
        }
      },
      patches () {
        return this.$store.state.history[this._id] || []
      },
      _id () {
        return this.item._id
      },
      objectStates () {
        return this.$store.state.states[this._id] || {}
      },
      itemAtDate () {
        return this.objectStates[this.date1]
      },
      name () {
        return this.route.params.name
      }
    },
    methods: {
      clickedDelete () {
        this.$store.dispatch('deleteItem', {object: this.object, _id: this._id})
      },
      clickedEdit () {
        router.push({name: `${this.object}/edit`, params: {name: this.name}})
      },
      clickedHistory () {
        if (!this.showHistory) {
          this.$store.dispatch('loadHistory', {object: this.object, _id: this._id})
        }
        this.showHistory = !this.showHistory
      },
      processKey (key) {
        const keys = key.split('/')
        const lastKey = keys[keys.length - 1]
        return this.firstLetterUpper(lastKey)
      },
      firstLetterUpper (string) {
        // noinspection JSUnresolvedFunction
        return string.charAt(0).toUpperCase() + string.slice(1)
      }
    },
    mounted () {
      if (this.actions && !this.object) {
        throw new Error('An object must be given if `actions === true`')
      }
    },
    watch: {
      date1 () {
        this.$store.dispatch('loadAtDate', {object: this.object, date: this.date1, _id: this._id})
      },
      date2 () {
        if (!this.date1 || !this.date2) {
          return
        }

        router.push({name: 'compare', params: {_id: this.course._id, then: this.date1, now: this.date2}})
      }
    }
  }
</script>

<style scoped>

</style>