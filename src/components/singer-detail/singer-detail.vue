<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
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
          this.songs = this._normalizeSongs(res.data.list)
          getSongKey(this.songs[0]).then(res => {
            let song = this.songs[0]
            song.url = `http://dl.stream.qqmusic.qq.com/C400${song.mid}.m4a?vkey=${res.data.items[0].vkey}&guid=862835478&uin=0&fromtag=66`
            // this.setPlaylist(this.songs)
          })
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
    ...mapMutations({
      setPlaylist: 'SET_PLAYLIST'
    })
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

