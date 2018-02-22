<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { getSongKey } from 'api/singer'

export default {
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      // 如果觉得排行榜的封面 丑，就换成第一首歌曲的封面，这里我就不换了
      /* if (this.songs.length) {
        return this.songs[0].image
      }
      return '' */
      return this.topList.picUrl
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    this._getMusicList()
  },
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  methods: {
    _getMusicList() {
      // 如果在当前页面 刷新，就回退到上一个页面
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
          // 先处理第一首歌曲的地址，为了用户点击“播放全部”的时候直接播放第一手哦
          getSongKey(this.songs[0]).then(res => {
            let song = this.songs[0]
            song.url = `http://dl.stream.qqmusic.qq.com/C400${song.mid}.m4a?vkey=${res.data.items[0].vkey}&guid=862835478&uin=0&fromtag=66`
          })
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })

      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
