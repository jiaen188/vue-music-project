import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

// 注册插件
Vue.use(Vuex)

// 我们在线下调试的时候NODE_ENV是dev，debug是true，开启严格模式，检测mutation/state修改是不是来源于commit
// npm run build的时候NODE_ENV是production
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})