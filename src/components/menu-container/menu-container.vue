<template>
  <div class="menu-container" :class="{'menu-container-expanded' : expanded}" >
    <ul class="list">
      <li :key="i"
          class="item"
          v-for="(t, i) in list">
        <img draggable="true"
             class="item-img"
             @dragstart="dragStart(t)"
             @dragend="dragEng"
             :src="t.url"
             :style="resetStyle(t)">
      </li>
    </ul>
    <div class="expand" @click="switchState">
      <svg class="icon" v-show="!expanded" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1520"><path d="M768.512 463.872zM351.744 977.92l417.28-416.768c13.312-12.8 20.48-30.208 20.48-49.152 0-18.432-7.168-35.84-20.48-49.152L351.744 47.104c-27.136-27.136-70.656-27.136-97.792 0-13.312 13.312-20.48 30.208-20.48 49.152s7.168 35.84 20.48 48.64l368.128 367.616-368.128 367.616c-13.312 13.312-20.48 30.208-20.48 48.64 0 18.432 7.168 35.84 20.48 48.64 26.624 27.648 70.656 27.648 97.792 0.512z" p-id="1521"></path></svg>
      <svg class="icon" v-show="expanded" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1630"><path d="M253.44 561.152zM670.72 47.104L253.44 463.36c-13.312 12.8-20.48 30.208-20.48 49.152 0 18.432 7.168 35.84 20.48 49.152L670.72 977.92c27.136 27.136 70.656 27.136 97.792 0 13.312-13.312 20.48-30.208 20.48-49.152s-7.168-35.84-20.48-48.64l-368.128-367.616 368.128-367.616c13.312-13.312 20.48-30.208 20.48-48.64 0-18.432-7.168-35.84-20.48-48.64-27.136-27.648-70.656-27.648-97.792-0.512z" p-id="1631"></path></svg>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
const MAX_DIS = 100
export default {
  name: 'menu-container',
  data () {
    return {
      list: [],
      expanded: false
    }
  },
  methods: {
    switchState () {
      this.expanded = !this.expanded
    },
    dragStart (t) {
      this.updateSelectedData(t)
    },
    dragEng () {
      this.updateSelectedData(null)
    },
    resetStyle (item) {
      // 全部小于最大值
      if (item.width <= MAX_DIS && item.height <= MAX_DIS) {
        if (item.width >= item.height) {
          return {width: `${MAX_DIS}px`, height: `auto`}
        } else {
          return {width: `auto`, height: `${MAX_DIS}px`}
        }
      }
      // 宽大于最大值，高小于最大值
      if (item.width > MAX_DIS && item.height <= MAX_DIS) {
        return {width: `${MAX_DIS}px`, height: `auto`}
      }
      // 宽小于最大值，高大于最大值
      if (item.width <= MAX_DIS && item.height > MAX_DIS) {
        return {width: `auto`, height: `${MAX_DIS}px`}
      }
      // 宽大于最大值，高大于最大值
      if (item.width > MAX_DIS && item.height > MAX_DIS) {
        if (item.width >= item.height) {
          return {width: `${MAX_DIS}px`, height: `auto`}
        } else {
          return {width: `auto`, height: `${MAX_DIS}px`}
        }
      }
    },
    ...mapMutations([
      'updateSelectedData'
    ])
  },
  created () {
    this.list = [
      {
        url: encodeURI('http://localhost:3000/images/安全阀.png'),
        width: 48,
        height: 111
      },
      {
        url: encodeURI('http://localhost:3000/images/火灾报警控制器.png'),
        width: 219,
        height: 296
      }
    ]
  }
}
</script>

<style scoped lang="stylus">
  .menu-container
    position absolute
    left -140px
    top 0
    width 180px
    height 100%
    box-sizing border-box
    padding 5px 0
    background-color #eee
    box-shadow 5px 5px 5px #aaa
    z-index 1
    transform translateX(0)
    transition 200ms linear
    &.menu-container-expanded
      transform translateX(140px)
    .list
      list-style none
      .item
        width 120px
        height 120px
        margin 5px 0 5px 10px
        border 1px solid
        display flex
        justify-content center
        align-items center
        .item-img
          display block
    .expand
      position absolute
      right 5px
      top 48%
      border 1px solid
      padding 0 5px 5px 5px
      cursor pointer
</style>
