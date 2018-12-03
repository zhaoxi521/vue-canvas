<template>
  <div class="canvas-container">
    <div class="handle" @click="resetMap">还原</div>
    <div class="wrapper">
      <canvas class="canvas" ref="canvas" @wheel="wheel" @mousedown.prevent="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp"
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
    },
    scaleVal: {
      type: Number,
      default: 0.1
    }
  },
  computed: {
    ...mapGetters([
      'selectedData'
    ])
  },
  methods: {
    initConfig () {
      // canvas图中的元素
      this.backImageList = []
      // 当前选中的元素
      this.selectedImage = null
      // 缩放比例值
      this.currentScale = 1
      // 平行移动超出值
      this.currentMoveX = 0
      this.currentMoveY = 0
      // 缩放状态
      this.scaleState = null
    },
    initCanvas () {
      this.ele = this.$refs.canvas
      this.ctx = this.ele.getContext('2d')
      this.width = this.ele.width = this.ele.offsetWidth
      this.height = this.ele.height = this.ele.offsetHeight
    },
    draw () {
      // 先清空画布
      this.clearRect()
      // 画图
      this.backImageList.forEach(t => t.draw())
    },
    clearRect () {
      this.ctx.clearRect(0, 0, this.width, this.height)
    },
    removeImageSelected () {
      if (!this.selectedImage) return
      this.selectedImage.selected = false
      this.draw()
    },
    wheel (e) {
      // 偏移的距离
      // 放大的倍数
      const offsetX = e.offsetX * this.scaleVal
      const offsetY = e.offsetY * this.scaleVal
      const scale = 1 + this.scaleVal
      // 更改所有图形对象的数据
      if (e.deltaY < 0) {
        // 放大
        this.backImageList.forEach(t => {
          t.width = t.width * scale
          t.height = t.height * scale
          t.x = t.x * scale - offsetX
          t.y = t.y * scale - offsetY
        })
        // 保存当前变化的值
        this.currentScale = this.currentScale * scale
        this.currentMoveX = this.currentMoveX * scale - offsetX
        this.currentMoveY = this.currentMoveY * scale - offsetY
      } else {
        // 缩小
        this.backImageList.forEach(t => {
          t.width = t.width / scale
          t.height = t.height / scale
          t.x = (t.x + offsetX) / scale
          t.y = (t.y + offsetY) / scale
        })
        // 保存当前变化的值
        this.currentScale = this.currentScale / scale
        this.currentMoveX = (this.currentMoveX + offsetX) / scale
        this.currentMoveY = (this.currentMoveY + offsetY) / scale
      }
      // 渲染
      this.draw()
    },
    mouseDown (e) {
      // 整理数据
      const currentX = e.offsetX
      const currentY = e.offsetY
      this.imageMoveStart = {x: currentX, y: currentY}
      // 检查是否有选中元素
      const selectedImageList = this.backImageList.filter(t => t.checkPos(currentX, currentY))
      const selectedImage = selectedImageList.length === 0 ? null : selectedImageList[selectedImageList.length - 1]
      if (selectedImage !== this.selectedImage) {
        // 清除选中状态
        this.removeImageSelected()
        this.selectedImage = selectedImage
      } else {
        // 判断已选中的元素是否要进行缩放
        this.scaleState = this.selectedImage ? this.selectedImage.checkPosPoint(currentX, currentY) : false
      }
      this.selectedState = true
      // 如果没有选中元素
      if (!this.selectedImage) return
      // 有选中元素
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
      // 如果没有选中元素
      if (!this.selectedImage) {
        this.backImageList.forEach(t => {
          t.move(disX, disY)
        })
        this.currentMoveX += disX
        this.currentMoveY += disY
      } else {
        if (this.scaleState) {
          // 左侧
          if (this.scaleState.indexOf('left') !== -1) {
            this.selectedImage.width -= disX
            this.selectedImage.x += disX / 2
          }
          // 右侧
          if (this.scaleState.indexOf('right') !== -1) {
            this.selectedImage.width += disX
            this.selectedImage.x += disX / 2
          }
          // 上
          if (this.scaleState.indexOf('top') !== -1) {
            this.selectedImage.height -= disY
            this.selectedImage.y += disY / 2
          }
          // 下
          if (this.scaleState.indexOf('bottom') !== -1) {
            this.selectedImage.height += disY
            this.selectedImage.y += disY / 2
          }
        } else {
          this.selectedImage.move(disX, disY)
        }
      }
      this.draw()
      this.imageMoveStart = {x: currentX, y: currentY}
    },
    mouseUp () {
      this.selectedState = false
      this.scaleState = null
    },
    resetMap () {
      this.backImageList.forEach(t => {
        t.width = t.width / this.currentScale
        t.height = t.height / this.currentScale
        t.x = (t.x - this.currentMoveX) / this.currentScale
        t.y = (t.y - this.currentMoveY) / this.currentScale
      })
      this.currentScale = 1
      this.currentMoveX = 0
      this.currentMoveY = 0
      this.draw()
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
    resize () {
      window.onresize = () => {
        this.initCanvas()
        this.draw()
      }
    }
  },
  mounted () {
    this.initConfig()
    this.initCanvas()
    this.resize()
  }
}
</script>

<style scoped lang="stylus">
  .canvas-container
    width 100%
    height 100%
    background-color #eee
    box-shadow 0 0 10px 5px #aaa
    position relative
    .handle
      position absolute
      left 0
      top -30px
      width 80px
      height 30px
      line-height 30px
      text-align center
      background aqua
      border-radius 5px
      cursor pointer
    .wrapper
      position absolute
      left 0
      top 0
      right 0
      bottom 0
      .canvas
        width 100%
        height 100%
</style>
