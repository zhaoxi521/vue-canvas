<template>
  <div class="canvas-container">
    <div class="handle" @click="resetMap">还原</div>
    <div class="wrapper">
      <canvas class="canvas" ref="canvas" :style="{cursor: scaleStyle}"
              @wheel="wheel"
              @mousedown.prevent="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp"
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
    scaleVal: {
      type: Number,
      default: 0.1
    }
  },
  data () {
    return {
      scaleStyle: ''
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
    draw (cb) {
      // 先清空画布
      this.clearRect()
      // 自己操作画图
      if (cb) {
        cb()
        return
      }
      // 默认操作画图
      this.backImageList.forEach(t => t.draw())
    },
    clearRect () {
      this.ctx.clearRect(0, 0, this.width, this.height)
    },
    removeImageSelected () {
      if (!this.selectedImage) return
      this.selectedImage.selected = false
      this.selectedImage = null
      this.draw()
    },
    wheel (e) {
      // 偏移的距离
      // 放大的倍数
      const offsetX = e.offsetX * this.scaleVal
      const offsetY = e.offsetY * this.scaleVal
      const scale = 1 + this.scaleVal
      // 更改所有图形对象的数据
      this.draw(() => {
        const flag = e.deltaY < 0
        this.backImageList.forEach(t => {
          t.width = flag ? this.countEnlarge(t.width, scale) : this.countNarrow(t.width, scale)
          t.height = flag ? this.countEnlarge(t.height, scale) : this.countNarrow(t.height, scale)
          t.x = flag ? this.countEnlargeAndMove(t.x, scale, offsetX) : this.countNarrowAndMove(t.x, scale, offsetX)
          t.y = flag ? this.countEnlargeAndMove(t.y, scale, offsetY) : this.countNarrowAndMove(t.y, scale, offsetY)
          t.draw()
        })
        // 保存当前变化的值
        this.currentScale = flag ? this.countEnlarge(this.currentScale, scale) : this.countNarrow(this.currentScale, scale)
        this.currentMoveX = flag ? this.countEnlargeAndMove(this.currentMoveX, scale, offsetX) : this.countNarrowAndMove(this.currentMoveX, scale, offsetX)
        this.currentMoveY = flag ? this.countEnlargeAndMove(this.currentMoveY, scale, offsetY) : this.countNarrowAndMove(this.currentMoveY, scale, offsetY)
      })
    },
    mouseDown (e) {
      // 鼠标按下以及后续操作的标识
      this.mouseDownState = true
      // 整理数据
      const currentX = e.offsetX
      const currentY = e.offsetY
      this.imageMoveStart = {x: currentX, y: currentY}
      // 检查是否有选中元素
      let selectedImageListOther = []
      let selectedImage = null
      const len = this.backImageList.length - 1
      for (let i = len; i >= 0; i--) {
        let t = this.backImageList[i]
        if (!selectedImage && t.checkPos(currentX, currentY)) {
          selectedImage = t
        } else {
          selectedImageListOther.push(t)
        }
      }
      // 确定选择区域
      if (!selectedImage) {
        // 选中空白区
        this.removeImageSelected()
        return
      }
      // 选中元素，确定是否要缩放还是拖动
      this.scaleState = selectedImage.checkPosPoint(currentX, currentY)
      // 清除上一个选中元素的样式
      this.selectedImage && this.selectedImage !== selectedImage && (this.selectedImage.selected = false)
      selectedImage.selected = true
      this.selectedImage = selectedImage
      this.backImageList = [...selectedImageListOther, this.selectedImage]
      this.draw()
    },
    mouseMove (e) {
      const currentX = e.offsetX
      const currentY = e.offsetY
      // 鼠标按下，才能移动的操作开关
      if (!this.mouseDownState) {
        // 改变选中元素的悬浮在上面鼠标样式
        const scaleState = this.selectedImage ? this.selectedImage.checkPosPoint(currentX, currentY) : ''
        this.resetMouseStyle(scaleState.length)
        return
      }
      // 选中元素
      const disX = currentX - this.imageMoveStart.x
      const disY = currentY - this.imageMoveStart.y
      // 保存当前值
      this.imageMoveStart = {x: currentX, y: currentY}
      // 如果没有选中元素
      if (!this.selectedImage) {
        this.draw(() => {
          this.backImageList.forEach(t => {
            t.move(disX, disY)
            t.draw()
          })
          this.currentMoveX += disX
          this.currentMoveY += disY
        })
        return
      }
      // 选中元素--进行拖拽
      if (this.scaleState) {
        this.dragScale(disX, disY)
        this.draw()
        return
      }
      // 选中元素，元素移动
      this.selectedImage.move(disX, disY)
      this.draw()
    },
    mouseUp () {
      this.mouseDownState = false
      this.scaleState = ''
    },
    dragScale (disX, disY) {
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
    },
    resetMap () {
      this.draw(() => {
        this.backImageList.forEach(t => {
          t.width = this.countNarrow(t.width, this.currentScale)
          t.height = this.countNarrow(t.height, this.currentScale)
          t.x = this.countNarrowAndMove(t.x, this.currentScale, -this.currentMoveX)
          t.y = this.countNarrowAndMove(t.y, this.currentScale, -this.currentMoveY)
          t.draw()
        })
      })
      this.currentScale = 1
      this.currentMoveX = 0
      this.currentMoveY = 0
    },
    drop (e) {
      this.removeImageSelected()
      const image = new ImageClass({
        ctx: this.ctx,
        option: {
          id: new Date().getTime(),
          url: this.selectedData.url,
          width: this.selectedData.width,
          height: this.selectedData.height,
          x: e.offsetX,
          y: e.offsetY
        }
      })
      this.backImageList.push(image)
      image.draw()
    },
    resetMouseStyle (len) {
      switch (len) {
        // top
        case 3:
          this.scaleStyle = 'n-resize'
          break
        // left
        case 4:
          this.scaleStyle = 'w-resize'
          break
        // right
        case 5:
          this.scaleStyle = 'e-resize'
          break
        // bottom
        case 6:
          this.scaleStyle = 's-resize'
          break
        // topleft
        case 7:
          this.scaleStyle = 'nw-resize'
          break
        // topright
        case 8:
          this.scaleStyle = 'ne-resize'
          break
        // bottomleft
        case 10:
          this.scaleStyle = 'sw-resize'
          break
        // bottomright
        case 11:
          this.scaleStyle = 'se-resize'
          break
        default:
          this.scaleStyle = 'default'
      }
    },
    resize () {
      window.onresize = () => {
        this.initCanvas()
        this.draw()
      }
    },
    countEnlarge (val, scale) {
      return val * scale
    },
    countEnlargeAndMove (val, scale, offset) {
      return val * scale - offset
    },
    countNarrow (val, scale) {
      return val / scale
    },
    countNarrowAndMove (val, scale, offset) {
      return (val + offset) / scale
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
