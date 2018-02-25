<template>
  <scroll class="suggest" 
          :data="result" 
          :pullup="pullup" 
          @scrollToEnd="searchMore" 
          :beforeScroll="beforeScroll" 
          ref="suggest" 
          @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li @click="selectItem(item)" v-for="item in result" class="suggest-item">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getSongKey } from 'api/singer'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      // 是否启动上拉更新
      pullup: true,
      hasMore: true,
      beforeScroll: true
    }
  },
  methods: {
    search () {
      // 第一次搜索，或者更改搜索关键词后，初始化相关数据
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    searchMore () {
      if (!this.hasMore) return
      this.page++
      search(this.query, this.page, !this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    getIconClass (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        let index = this.playlist.findIndex(song => item.id === song.id)

        if (index > -1) {
          this.insertSong(item)
        } else {
          getSongKey(item).then(res => {
            item.url = `http://dl.stream.qqmusic.qq.com/C400${item.mid}.m4a?vkey=${res.data.items[0].vkey}&guid=862835478&uin=0&fromtag=66`
            this.insertSong(item)
          })
        }
      }

      this.$emit('select')
    },
    refresh () {
      this.$refs.suggest.refresh()
    },
    // 在移动端，输入搜索框的时候，会出现键盘，搜索结果列表滚动的时候，键盘不会收起
    // 所以我们在scroll组件中中监听beforeScrollStart，接收到scroll组件信号后， emit一个listScroll到search组件，用来使输入框失去焦点，就收起了键盘
    listScroll () {
      this.$emit('listScroll')
    },
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSong(data.song.list))
      }
      return ret
    },
    _normalizeSong (list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query () {
      this.search()
    }
  },
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
