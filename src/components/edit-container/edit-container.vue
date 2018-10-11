<template>
  <div class="edit-container">
    <menu-container></menu-container>
    <canvas-container></canvas-container>
  </div>
</template>

<script>
import CanvasContainer from 'components/canvas-container/canvas-container'
import MenuContainer from 'components/menu-container/menu-container'
export default {
  name: 'edit-container',
  components: {
    CanvasContainer,
    MenuContainer
  }
}
</script>

<style scoped lang="stylus">
  .edit-container
    width 100%
    height 100%
    padding 50px 100px
    box-sizing border-box
    display flex
    justify-content space-around
    align-items center
    background linear-gradient(70deg, bisque, #FFFCC8);
</style>
