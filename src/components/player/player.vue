<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <!-- 大的页面级别的播放器页面 -->
        <div class="normal-player" v-show="fullScreen">
        <div class="background">
            <img width="100%" :src="currentSong.image" alt="">
        </div>
        <div class="top">
            <div class="back" @click="back">
            <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" 
            @touchstart.prevent="middleTouchStart"
            @touchmove.prevent="middleTouchMove"
            @touchend="middleTouchEnd">
            <div class="middle-l" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                  <div class="cd" :class="cdClass">
                  <img class="image" :src="currentSong.image" alt="">
                  </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{playingLyric}}</div>
              </div>
            </div>
            <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
              <div class="lyric-wrapper">
                <div v-if="currentLyric">
                  <p ref="lyricLine"
                      class="text"
                      :class="{'current': currentLineNum === index}"
                      v-for="(line, index) in currentLyric.lines">{{line.txt}}</p>
                </div>
              </div>
            </scroll>
        </div>
        <div class="bottom">
            <div class="dot-wrapper">
              <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
              <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
            </div>
            <div class="progress-wrapper">
              <span class="time time-l">{{format(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                <progress-bar @percentChange="onProgressBarChange" :percent="percent"></progress-bar>
              </div>
              <span class="time time-r">{{format(currentSong.duration)}}</span>
            </div>
            <div class="operators">
              <div class="icon i-left" @click="changeMode">
                  <i :class="iconMode"></i>
              </div>
              <div class="icon i-left" :class="disableClass">
                  <i @click="prev" class="icon-prev"></i>
              </div>
              <div class="icon i-center" :class="disableClass">
                  <i @click="togglePlaying" :class="playIcon"></i>
              </div>
              <div class="icon i-right" :class="disableClass">
                  <i @click="next" class="icon-next"></i>
              </div>
              <div class="icon i-right">
                  <i class="icon-not-favorite"></i>
              </div>
            </div>
        </div>
        </div>
    </transition>
    <transition name="mini">
      <!-- 小的迷你的播放器页面 -->
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdClass" width="40" height="40" :src="currentSong.image" alt="">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" :class="miniIcon" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control" @click="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio ref="audio" 
          :src="currentSong.url" 
          @canplay="ready" 
          @error="error"
          @timeupdate="updateTime"
          @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import { getSongKey } from 'api/singer'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import Lyric from 'lyric-parser'
import { getSongLyric } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Playlist from 'components/playlist/playlist'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  data () {
    return {
      songReady: false,
      // 当前歌词播放了多少时间
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      // 当前歌词所在的行
      currentLineNum: 0,
      // 当前是显示封面image 还是歌词
      currentShow: 'cd',
      // 当前播放的歌词
      playingLyric: ''
    }
  },
  computed: {
    cdClass () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableClass () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  created () {
    this.touch = {}
  },
  methods: {
    open () {
      this.setFullScreen(true)
    },
    back () {
      this.setFullScreen(false)
    },
    // 从迷你播放器 ，到页面播放器时候， image的动画
    enter (el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      // 注册animation
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      // 启动动画move
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    // 清空动画
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    // 从页面播放器到 迷你播放器的动画，这次简单点，只移动
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    // 清空动画
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // 切换播放状态
    togglePlaying () {
      // 如果audio还没有加载好，就不让用户点击
      if (!this.songReady) {
        return
      }
      // setPlayingState是从 mapMutations获取的，playing是从 mapGetters中获取的
      // 改变的只是vuex中的状态，所以要在watch中根据状态做不同的处理
      this.setPlayingState(!this.playing)
      // 暂停歌曲的时候，如果有歌词，就要停止歌词状态
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 如果当前歌曲播放结束
    end () {
      // 如果是 循环当前
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        // 如果是顺序播放， 或者随机播放，就播放下一首
        this.next()
      }
    },
    // 当播放顺序是 循环当前时， 歌曲播放到最后end，可以把currentTime设置为0， 就又会重新开始播放
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      // 循环当前歌曲的时候，歌曲播放完成后， 要把当前歌词状态重置到初始状态
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    next () {
      // 如果audio还没有加载好，就不让用户点击
      if (!this.songReady) return
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      // 现在的歌曲地址，需要一个key， 所以我们先通过vuex改变playlist，再改变currentIndex， 最后改变currentSong
      let song = Object.assign({}, this.playlist[index])
      // let song = this.playlist[index]
      getSongKey(song).then(res => {
        song.url = `http://dl.stream.qqmusic.qq.com/C400${song.mid}.m4a?vkey=${res.data.items[0].vkey}&guid=862835478&uin=0&fromtag=66`
        // let newPlaylist = JSON.parse(JSON.stringify(this.playlist))
        let newPlaylist = this.playlist.slice()
        newPlaylist[index] = song

        this.setPlaylist(newPlaylist)
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      })
    },
    prev () {
      // 如果audio还没有加载好，就不让用户点击
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length - 1
      }
      // 现在的歌曲地址，需要一个key， 所以我们先通过vuex改变playlist，再改变currentIndex， 最后改变currentSong
      let song = Object.assign({}, this.playlist[index])
      getSongKey(song).then(res => {
        song.url = `http://dl.stream.qqmusic.qq.com/C400${song.mid}.m4a?vkey=${res.data.items[0].vkey}&guid=862835478&uin=0&fromtag=66`
        let newPlaylist = this.playlist.slice()
        newPlaylist[index] = song

        this.setPlaylist(newPlaylist)
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      })
    },
    // 防止快速点击切换
    ready () {
      this.songReady = true
    },
    // 如果网络出现问题，或者url有问题，我们也设置 songReady为true，可以让用户切换歌曲
    error () {
      this.songReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime // 这个属性可读可写
    },
    format (interval) {
      interval = interval | 0 // 相当于向上取整
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    // 接收到 progress-bar组件拖动完成touchend后， emit出来的percent，然后重新设置currentTime
    onProgressBarChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      // 拖动到某个位置后，我们希望音乐播放
      if (!this.playing) {
        this.togglePlaying(this.playing)
      }
      // 当歌曲进度被用户调整时候， 需要调整歌词位置
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // 点击切换模式
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 当改变 playlist的时候，由于index不变，currentSong会变化，为了保证currentSong不变，我们要重置currentIndex
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    // 重置当前的index
    resetCurrentIndex (list) {
      let index = list.findIndex(item => item.id === this.currentSong.id)
      this.setCurrentIndex(index)
    },
    // 获取歌词
    getLyric() {
      getSongLyric(this.currentSong).then(res => {
        this.currentLyric = new Lyric(res, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        // 如果获取歌词失败，清理歌词，当前歌词，当前歌词的行数
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    // 当歌词每一行改变的时候， 回调一下这个函数
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      // 如果只有5行，歌词就不用随着滚动
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        // 小于5行， 直接滚到顶部就行
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      // 当前播放发的歌词
      this.playingLyric = txt
    },
    showPlaylist () {
      this.$refs.playlist.show()
    },
    middleTouchStart (e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) return
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      // 如果纵向的滚动 大于 横向， 就认为不是想要切换到歌词列表， 因为歌词页面是可以上下滚动的，防止出现冲突
      if (Math.abs(deltaY) > Math.abs(deltaX)) return
      // left是指， 歌词面板的左边 距离 手机视口的右边 的距离
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      // offsetWidth 是指 歌词面板的 可偏移范围
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      // 移动歌词的位置
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      // 设置渐变动画时间
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      // 滑动的时候， 改变中间iamge 的透明度
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd () {
      let offsetWidth
      let opacity
      // 从右向左滑动
      if (this.currentShow === 'cd') {
        // 如果滑动超过 10%， 就切换到歌词
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          // 不到10%， 就变回原来的面板
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      // 滑动结束， 设置歌词面板到底在什么位置
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      // 渐变动画设置时间为 300ms
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      // 滑动的时候， 改变中间iamge 的透明度
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
    },
    // 补零函数
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _getPosAndScale () {
      // 迷你播放器中 image的宽度， 圆心到左边距，圆形到底边距
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30

      // 页面播放器中 image的边缘到顶边距, 宽度
      const paddingTop = 80
      const width = window.innerWidth * 0.8

      // 两个image的缩放比例
      const scale = targetWidth / width
      // 两个image在x轴上的 距离
      const x = -(window.innerWidth / 2 - paddingLeft)
      // y轴的距离
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlaylist: 'SET_PLAYLIST',
      setPlayMode: 'SET_PLAY_MODE'
    })
  },
  watch: {
    currentSong (newSong, oldSong) {
      // 当我们切换播放顺序的时候，为了确保当前播放的歌曲不变，我们重置了currentIndex，实际上currentSong是已经改变了（数组的index变了），
      // 所以说会触发这个计算属性, 因此我们判断，newSong和oldSong的id不变，就是同一首，不执行接下来，
      // 否则当用户暂停播放的时候，再切换个播放顺序，下一首会播放
      if (newSong.id === oldSong.id) return
      // 如果已经有歌词， 切换歌词的时候，要先把当前歌词停止掉
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      setTimeout(() => {
        this.$refs.audio.play()
        // 获取歌词
        this.getLyric()
      }, 1000)
    },
    // 检测到vuex中播放状态的变化，做对应的处理
    playing (newPlaying) {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
