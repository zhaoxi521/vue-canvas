import Vue from 'vue'
import Router from 'vue-router'
import EditContainer from 'components/edit-container/edit-container'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: EditContainer
    }
  ]
})
