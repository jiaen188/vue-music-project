import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

function findIndex (list, song) {
  return list.findIndex(item => item.id === song.id)
}

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

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]

  // 看一下我们要添加的歌曲，是否已经在playlist
  let fpIndex = findIndex(playlist, song)

  // 因为是插入歌曲，所以currentIndex要加1
  currentIndex++
  // 添加一首歌，在当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含这首歌曲
  if (fpIndex > -1) {
    // 如果当前添加的序号，大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}