<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" v-for="(song, index) in songs" class="item">
        <div class="rank" v-show="rank">
          <span :class="getRankClass(index)">{{getRankTxt(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <!-- <p class="desc">{{song.singer}}·{{song.album}}</p> -->
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSongKey } from 'api/singer'

export default {
  props: {
    songs: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem (item, index) {
      // 歌曲被点击后，emit出去告诉外层组件，song和index
      getSongKey(item).then(res => {
        // let song = Object.assign({}, item)
        item.url = `http://dl.stream.qqmusic.qq.com/C400${item.mid}.m4a?vkey=${res.data.items[0].vkey}&guid=862835478&uin=0&fromtag=66`
        this.$emit('select', item, index)
      })
    },
    getDesc (song) {
      return `${song.singer}·${song.album}`
    },
    // 单独为排行榜的歌曲列表准备的，前面名的样式有多一个奖杯
    getRankClass (index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    // 单独为排行榜的歌曲列表准备的
    getRankTxt (index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
