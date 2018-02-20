function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 把数组打乱
export function shuffle (arr) {
  let _arr = JSON.parse(JSON.stringify(arr))
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}