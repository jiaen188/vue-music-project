<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>
<script type="text/esmascript-6">
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      // 保证不会出错， wrapper已经存在了才执行
      if (!this.$refs.wrapper) return
      this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
      })
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        // 因为获取歌单列表  是一个异步的过程，所以要在scroll组件传入属性:data然后监听data变化再refresh
        this.refresh()
      }, 20);
    }
  }
}
</script>

<style lang="stylus" scoped ref="stylesheet/stylus">

</style>
