import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  // getLyric () {
  //   if (this.lyric) {
  //     return Promise.resolve(this.lyric)
  //   }

  //   return new Promise((resolve, reject) => {
  //     getLyric(this.mid).then(res => {
  //       if (res.code === ERR_OK) {
  //         this.lyric = Base64.decode(res.lyric)
  //         resolve(this.lyric)
  //       } else {
  //         reject('no lyric')
  //       }
  //     })
  //   })
  // }
}

export function getSongLyric (song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }

  return new Promise((resolve, reject) => {
    getLyric(song.mid).then(res => {
      if (res.code === ERR_OK) {
        song.lyric = Base64.decode(res.lyric)
        resolve(song.lyric)
      } else {
        reject('no lyric')
      }
    })
  })
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // 这里的vkey是不对的，要另外用接口 getSongKey获取
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=15DAB87465371D2108667DEF560180D89877FF5F05CE9C373C22C06F2971245AF0F12EDF20878585BAC525290C6D30496D7EA2027C155A0A&guid=862835478&uin=0&fromtag=66`
  })
}

function filterSinger (singers) {
  let ret = []
  if (!singers) return ''
  singers.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}