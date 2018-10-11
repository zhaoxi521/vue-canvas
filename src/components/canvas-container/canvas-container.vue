<template>
  <div class="canvas-container">
    <canvas class="canvas" ref="canvas" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp"
            @dragover.prevent @drop.prevent="drop"></canvas>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ImageClass from 'common/js/image'
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
  computed: {
    ...mapGetters([
      'selectedData'
    ])
  },
  methods: {
    initCanvas () {
      this.ele = this.$refs.canvas
      this.ctx = this.ele.getContext('2d')
      this.width = this.ele.width = this.ele.offsetWidth
      this.height = this.ele.height = this.ele.offsetHeight
    },
    initConfig () {
      this.backImageList = []
      this.selectedImage = null
    },
    draw () {
      // 先清空画布
      this.clearRect()
      // 画图
      this.backImageList.forEach(t => t.draw())
    },
    mouseDown (e) {
      const currentX = e.offsetX
      const currentY = e.offsetY
      this.imageMoveStart = {x: currentX, y: currentY}
      const selectedImageList = this.backImageList.filter(t => t.checkPos(currentX, currentY))
      this.selectedImage = selectedImageList.length === 0 ? null : selectedImageList[selectedImageList.length - 1]
      // 如果没有选中元素
      if (!this.selectedImage) return
      const selectedImageListOther = this.backImageList.filter(t => t.id !== this.selectedImage.id)
      this.backImageList = [...selectedImageListOther, this.selectedImage]
      this.draw()
    },
    mouseMove (e) {
      if (!this.selectedImage) return
      const currentX = e.offsetX
      const currentY = e.offsetY
      const disX = currentX - this.imageMoveStart.x
      const disY = currentY - this.imageMoveStart.y
      this.selectedImage.move(disX, disY)
      this.draw()
      this.imageMoveStart = {x: currentX, y: currentY}
    },
    mouseUp () {
      this.selectedImage = null
    },
    drop (e) {
      this.backImageList.push(new ImageClass({
        ctx: this.ctx,
        option: {
          id: new Date().getTime(),
          url: this.selectedData.url,
          width: this.selectedData.width,
          height: this.selectedData.height,
          x: e.offsetX,
          y: e.offsetY
        }
      }))
      this.draw()
    },
    clearRect () {
      this.ctx.clearRect(0, 0, this.width, this.height)
    }
  },
  mounted () {
    this.initCanvas()
    this.initConfig()
  }
}
</script>

<style scoped lang="stylus">
  .canvas-container
    width 50%
    height 100%
    background-color #eee
    box-shadow 5px 5px 5px #aaa
    overflow hidden
    .canvas
      width 100%
      height 100%
</style>
