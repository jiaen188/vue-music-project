import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, isPlaying) {
    state.playing = isPlaying
  },
  [types.SET_FULL_SCREEN](state, isFullscreen) {
    state.fullScreen = isFullscreen
  },
  [types.SET_PLAYLIST](state, newPlaylist) {
    state.playlist = newPlaylist
  },
  [types.SET_SEQUENCE_LIST](state, newSequenceList) {
    state.sequenceList = newSequenceList
  },
  [types.SET_PLAY_MODE](state, newMode) {
    state.mode = newMode
  },
  [types.SET_CURRENT_INDEX](state, newIndex) {
    state.currentIndex = newIndex
  },
  [types.SET_DISC](state, newDisc) {
    state.disc = newDisc
  },
  [types.SET_TOP_LIST](state, newTopList) {
    state.topList = newTopList
  }
}

export default mutations