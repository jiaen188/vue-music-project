<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail, getSongKey } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      // 相当于getter中singer方法, 然后绑定在this.singer上
      'singer'
    ])
  },
  created () {
    console.log(this.singer)
    this._getDetail()
  },
  methods: {
    _getDetail () {
      // 如果在歌手详情页面刷新了，就返回歌手列表页面，singer是空对象，所以返回
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          console.log(res)
          this.songs = this._normalizeSongs(res.data.list)
          console.log(this.songs)
          this._getSongKey(this.songs[0])
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _getSongKey (musicData) {
      getSongKey(musicData).then(res => {
        console.log('获取了歌曲的key')
        console.log(res)
      })
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped ref="stylesheer/stylus">
  @import '~~common/stylus/variable'

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)  
</style>

