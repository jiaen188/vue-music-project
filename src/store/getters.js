export const singer = state => state.singer

// 歌曲是否播放
export const playing = state => state.playing

// 歌曲播放页面， 是否全屏
export const fullScreen = state => state.fullScreen

// 歌曲列表
export const playlist = state => state.playlist

// 歌曲的播放顺序列表（不同的播放类型，歌曲的播放顺序不同）
export const sequenceList = state => state.sequenceList

// 播放模式
export const mode = state => state.mode

// 当前播放哪一首歌曲
export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
