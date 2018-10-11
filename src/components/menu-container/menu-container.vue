<template>
  <div class="menu-container">
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
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
const MAX_DIS = 100
export default {
  name: 'menu-container',
  data () {
    return {
      list: []
    }
  },
  methods: {
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
    width 30%
    height 100%
    box-sizing border-box
    padding 5px 0
    background-color #eee
    box-shadow 5px 5px 5px #aaa
    .list
      list-style none
      display flex
      flex-wrap wrap
      justify-content space-around
      .item
        width 120px
        height 120px
        margin 5px 0
        border 1px solid
        display flex
        justify-content center
        align-items center
        .item-img
          display block
</style>
