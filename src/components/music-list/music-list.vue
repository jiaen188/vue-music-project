<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playButton" @click="playAll">
          <i class="icon-play"></i>
          <span class="text">播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import { prefixStyle } from 'common/js/dom'
import { mapActions, mapMutations } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const RESERVER_HEIGHT = 40
const transform = prefixStyle('transform')

export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  created () {
    // probeType为1是表示缓动动画, 3是快速滚动动画
    this.probeType = 3
    // 是否需要监听滚动， 默认不需要，现在是需要的，那么scroll组件就会在滚动的时候emit一个pos出来，然后外层组件用scroll事件接收
    this.listenScroll = true
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 为了保留标题的高度，可滚动距离还要再小 40
    this.minTranslateY = -this.imageHeight + RESERVER_HEIGHT
    // 背景图片是自适应的，所以要获取高度，在赋值给scroll的top
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    // 接收scroll组件在 滚动的时候， 实时emit出来的pos
    scroll (pos) {
      this.scrollY = pos.y
    },
    back () {
      this.$router.back()
    },
    selectItem (selectSong, index) {
      // let newPlaylist = JSON.parse(JSON.stringify(this.songs))
      let newPlaylist = this.songs.slice()
      newPlaylist[index] = selectSong
      this.setPlaylist(newPlaylist)
      // 接收到 song-list组件的点击时，emit出来的 item和index
      this.selectPlay({
        list: newPlaylist,
        index
      })
    },
    random () {
      this.randomPlay({
        list: this.songs
      })
    },
    // 播放此专辑
    playAll () {
      this.sequencePlay({
        list: this.songs
      })
    },
    ...mapMutations({
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'selectPlay',
      'randomPlay',
      'sequencePlay'
    ])
  },
  watch: {
    scrollY (newY) {
      // 因为layer这个dom的高度是100%手机屏幕，所以layer滚动的距离是 从0 到 -bgImage（向上为负）， newY是0，到负无穷，为了体验好留出 标题的高度，可滚动距离还要再小40
      let translateY = Math.max(this.minTranslateY, newY)
      /* this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
      this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${translateY}px, 0)` */
      // 做了一个样式 预处理的通用方法 tranform
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`

      let zIndex = 0
      // 当layer滚动到高度为刚好接触到 标题时，需要我们把bgImage背景图的高度 height设置为40px，zindex这是为10
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVER_HEIGHT}px`
        // “随机播放按钮的显示，隐藏”
        this.$refs.playButton.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playButton.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex

      // 下滑到最底部的时候， 再下滑，背景图有个放大效果
      let scale = 1
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      }
      /* this.$refs.bgImage.style['transform'] = `scale(${scale})`
      this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})` */
      // 做了一个样式预处理的通用方法 transform
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      this.$refs.bgImage.style.zIndex = zIndex
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>