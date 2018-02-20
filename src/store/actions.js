import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

// 多个mutations可以封装成一个action
// 这是有关点击歌曲播放的几个mutations, 封装成了一个action
export const selectPlay = function ({commit}, {list, index}) {
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

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 播放全部专辑
export const sequencePlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.sequence)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}