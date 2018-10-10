import Vue from 'vue'
import Router from 'vue-router'
import CanvasContainer from 'components/canvas-container/canvas-container'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'canvas-container',
      component: CanvasContainer
    }
  ]
})
