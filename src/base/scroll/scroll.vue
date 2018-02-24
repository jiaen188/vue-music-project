<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>
<script type="text/esmascript-6">
import BScroll from 'better-scroll'

export default {
  props: {
    // probeType为1是表示缓动动画
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
    },
    // 是否需要监听滚动， 默认不需要， 如果需要要在初始化中emit一个pos
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 是否开启上拉刷新
    pullup: {
      type: Boolean,
      default: false
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

      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', pos => {
          me.$emit('scroll', pos)
        })
      }

      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          // 快滚动到底部了
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
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
