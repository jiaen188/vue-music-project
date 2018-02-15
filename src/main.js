import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'

import 'common/stylus/index.styl'

fastclick.attach(document.body) // 解决移动端快速点击问题，同时没有300ms的延迟

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
