import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
// import axios from 'axios'

export function getSingerList () {
  // 歌手列表的数据来源 https://y.qq.com/portal/singer_list.html
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 1664029744
  })

  return jsonp(url, data, options)
}

export function getSingerDetail (singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    singermid: singerId,
    g_tk: 1664029744
  })

  return jsonp(url, data, options)
}

// 原来在文件song.js中的creteSong函数中的url接口不能用了，需要重新获取一下vkey，真不知道有什么意义
export function getSongKey (musicData) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid: musicData.mid,
    filename: `C400${musicData.mid}.m4a`,
    guid: 862835478,
    // 这里的callback和jsonpCallback也是随便去官网用的一个
    callback: 'MusicJsonCallback9389620123445979',
    jsonpCallback: 'MusicJsonCallback9389620123445979'
  })

  return jsonp(url, data)
}