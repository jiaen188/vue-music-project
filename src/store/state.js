import { playMode } from 'common/js/config'
const state = {
  singer: {},
  // 歌曲是否播放
  playing: false,
  // 歌曲播放页面， 是否全屏
  fullScreen: false,
  // 歌曲列表
  playlist: [],
  // 歌曲的播放顺序列表（不同的播放类型，歌曲的播放顺序不同）
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放哪一首歌曲
  currentIndex: -1,
  // 推荐页面中的， 热门歌单的数据
  disc: {}
}

export default state