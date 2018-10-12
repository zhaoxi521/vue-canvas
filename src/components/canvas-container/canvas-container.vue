<template>
  <div class="canvas-container">
    <div class="handle">
      <div class="handle-scale">
        <div class="handle-scale-item" @click="scaleImage(true)">变大</div>
        <div class="handle-scale-item" @click="scaleImage(false)">变小</div>
      </div>
      <div class="handle-move">
        <div :key="t" class="handle-move-item" v-for="t in 4">
          <div class="handle-move-item-svg" @click="moveImage(t)">
            <svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1540"><path d="M226.350355 554.466274L643.440791 971.147397c23.023883 23.023883 60.373738 23.02388299 83.397622 0 23.126212-23.023883 23.126212-60.27141 0-83.295293l-375.238133-374.931148 375.238133-375.033477c23.126212-23.023883 23.126212-60.27141 0-83.295293-23.023883-23.023883-60.373738-23.02388299-83.397622 0L226.350355 471.17098C203.32647101 494.092535 203.326471 531.544719 226.350355 554.466274L226.350355 554.466274z" p-id="1541"></path></svg>
          </div>
        </div>
      </div>
      <div class="handle-delete">
        <div class="handle-delete-item" @click="deleteImage">删除</div>
      </div>
    </div>
    <div class="wrapper">
      <canvas class="canvas" ref="canvas" @mousedown.prevent="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp"
              @dragover.prevent @drop.prevent="drop"></canvas>
    </div>
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
    scaleImage (flag) {
      if (!this.selectedImage) return
      this.selectedImage.scale(flag)
      this.draw()
    },
    moveImage (t) {
      if (!this.selectedImage) return
      const DIS = 1
      switch (t) {
        case 1:
          this.selectedImage.move(-DIS, 0)
          break
        case 2:
          this.selectedImage.move(0, -DIS)
          break
        case 3:
          this.selectedImage.move(DIS, 0)
          break
        case 4:
          this.selectedImage.move(0, DIS)
          break
      }
      this.draw()
    },
    deleteImage () {
      if (!this.selectedImage) return
      this.backImageList = this.backImageList.filter(t => t.id !== this.selectedImage.id)
      this.draw()
    },
    mouseDown (e) {
      // 先清除选中状态
      this.removeImageSelected()
      // 整理数据
      const currentX = e.offsetX
      const currentY = e.offsetY
      this.imageMoveStart = {x: currentX, y: currentY}
      // 检查是否有选中元素
      const selectedImageList = this.backImageList.filter(t => t.checkPos(currentX, currentY))
      this.selectedImage = selectedImageList.length === 0 ? null : selectedImageList[selectedImageList.length - 1]
      // 如果没有选中元素
      if (!this.selectedImage) return
      // 有选中元素
      this.selectedState = true
      this.selectedImage.selected = true
      const selectedImageListOther = this.backImageList.filter(t => t.id !== this.selectedImage.id)
      this.backImageList = [...selectedImageListOther, this.selectedImage]
      this.draw()
    },
    mouseMove (e) {
      // 没有选中元素
      if (!this.selectedState) return
      // 选中元素
      const currentX = e.offsetX
      const currentY = e.offsetY
      const disX = currentX - this.imageMoveStart.x
      const disY = currentY - this.imageMoveStart.y
      this.selectedImage.move(disX, disY)
      this.draw()
      this.imageMoveStart = {x: currentX, y: currentY}
    },
    mouseUp () {
      this.selectedState = false
    },
    drop (e) {
      this.removeImageSelected()
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
    removeImageSelected () {
      if (!this.selectedImage) return
      this.selectedImage.selected = false
      this.draw()
    },
    clearRect () {
      this.ctx.clearRect(0, 0, this.width, this.height)
    },
    resize () {
      window.onresize = () => {
        this.initCanvas()
        this.draw()
      }
    }
  },
  mounted () {
    this.initCanvas()
    this.initConfig()
    this.resize()
  }
}
</script>

<style scoped lang="stylus">
  .canvas-container
    width 70%
    height 100%
    background-color #eee
    box-shadow 5px 5px 5px #aaa
    position relative
    .handle
      width 100%
      height 150px
      box-sizing border-box
      border-bottom 1px solid
      display flex
      .handle-scale
        margin 14px 0 0 15px
        width 120px
        height 120px
        border 1px solid
        display flex
        flex-direction column
        justify-content center
        align-items center
        .handle-scale-item
          margin-top 5px
          width 80px
          height 40px
          text-align center
          line-height 40px
          font-size 16px
          border 1px solid
          cursor pointer
          user-select none
      .handle-move
        margin 14px 0 0 15px
        width 120px
        height 120px
        border 1px solid
        position relative
        .handle-move-item
          position absolute
          left 0
          top 45px
          height 30px
          width 60px
          box-sizing border-box
          padding-left 8px
          transform-origin right center
          &:nth-child(2)
            transform rotateZ(90deg)
          &:nth-child(3)
            transform rotateZ(180deg)
          &:nth-child(4)
            transform rotateZ(270deg)
          .handle-move-item-svg
            width 30px
            height 30px
            border 1px solid
            box-sizing border-box
            display flex
            justify-content center
            align-items center
            cursor pointer
      .handle-delete
        margin 14px 0 0 15px
        width 120px
        height 120px
        border 1px solid
        display flex
        justify-content center
        align-items center
        .handle-delete-item
          width 100px
          height 40px
          text-align center
          line-height 40px
          border 1px solid
          cursor pointer
          user-select none
    .wrapper
      position absolute
      left 0
      top 150px
      right 0
      bottom 0
      .canvas
        width 100%
        height 100%
</style>
