import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedData: null
  },
  getters: {
    selectedData: state => state.selectedData
  },
  mutations: {
    updateSelectedData (state, data) {
      this.state.selectedData = data
    }
  }
})
