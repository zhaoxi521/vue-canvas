<template>
  <div class="canvas-container">
    <div class="wrapper"
         ref="wrapper"
         draggable="true"
         :style="{width: `${defaultWidth}px`, height: `${defaultHeight}px`}"
         @dragstart="dragStart" @dragover.prevent="dragOver" @drop.prevent="drop">
      <canvas class="canvas" ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import ImageClass from 'common/js/image'
// const WRAPPER_WIDTH = 800
// const WRAPPER_HEIGHT = 600
export default {
  name: 'canvas-container',
  props: {
    defaultWidth: {
      type: Number,
      default: 1000
    },
    defaultHeight: {
      type: Number,
      default: 1000
    }
  },
  methods: {
    initCanvas () {
      this.ele = this.$refs.canvas
      this.ctx = this.ele.getContext('2d')
      this.width = this.ele.width = this.defaultWidth
      this.height = this.ele.height = this.defaultHeight
    },
    draw () {
      // 先清空画布
      this.clearRect()
      // 获取图片实例并画图
      this.list.map(t => {
        return new ImageClass({
          ctx: this.ctx,
          option: {
            url: t.url,
            width: t.width,
            height: t.height,
            x: t.x,
            y: t.y
          }
        })
      }).forEach(d => d.draw())
    },
    // 拖拽事件
    dragStart (e) {
      this.dragState = true
      this.startPos = {x: e.x, y: e.y}
    },
    dragOver (e) {
      if (!this.dragState) return
      if (this.overPos && this.overPos.x === e.x && this.overPos.y === e.y) return
      // 获取最新位置
      this.overPos = {x: e.x, y: e.y}
      const disX = this.overPos.x - this.startPos.x
      const disY = this.overPos.y - this.startPos.y
      this.setElePos(disX, disY)
    },
    drop (e) {
      this.dragState = false
      this.endPos = {x: e.x, y: e.y}
      const disX = this.endPos.x - this.startPos.x
      const disY = this.endPos.y - this.startPos.y
      this.setElePos(disX, disY)
      this.pos = {x: this.pos.x + disX, y: this.pos.y + disY}
    },
    setElePos (disX, disY) {
      const currentX = this.pos.x + disX
      const currentY = this.pos.y + disY
      this.$refs.wrapper.style.transform = `translate(${currentX}px, ${currentY}px)`
    },
    clearRect () {
      this.ctx.clearRect(0, 0, this.width, this.height)
    }
  },
  mounted () {
    this.initCanvas()
    this.draw()
  },
  created () {
    this.pos = {x: 0, y: 0}
    this.list = [
      {url: 'http://localhost:3000/image/beauty.jpg', width: 400, height: 300, x: 0, y: 0},
      {url: 'http://localhost:3000/image/beauty1.jpg', width: 400, height: 300, x: 400, y: 0}
    ]
  }
}
</script>

<style scoped lang="stylus">
  .canvas-container
    width 800px
    height 600px
    overflow hidden
    margin 100px auto 0
    border 1px solid
</style>
