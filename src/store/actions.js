import * as types from './mutation-types'

// 多个mutations可以封装成一个action
// 这是有关点击歌曲播放的几个mutations, 封装成了一个action
export const selectPlay = function ({commit, state}, {list, index}) {
  // 歌曲的播放顺序列表（不同的播放类型，歌曲的播放顺序不同）
  commit(types.SET_SEQUENCE_LIST, list)
  // 歌曲列表
  commit(types.SET_PLAYLIST, list)
  // 当前播放哪一首歌曲
  commit(types.SET_CURRENT_INDEX, index)
  // 歌曲播放页面， 是否全屏
  commit(types.SET_FULL_SCREEN, true)
  // 歌曲是否播放
  commit(types.SET_PLAYING_STATE, true)
}