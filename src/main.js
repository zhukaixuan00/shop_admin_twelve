// 引入Element-ui的样式
// import 'element-ui/lib/theme-chalk/index.css'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Vue from 'vue'
import App from './App'
import router from './router'

// 导入axios
import axios from 'axios'

// 导入moment
import moment from 'moment'

// 导入vue-quill-editor富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 引入Element-ui
import ElementUI from 'element-ui'

Vue.use(VueQuillEditor)

// 使用Element-ui
Vue.use(ElementUI)

Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input).format(format)
})

// 把axios对象绑定到Vue原型中
Vue.prototype.axios = axios

// 给axios添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.baseURL = 'http://localhost:8888/api/private/v1/'
  config.headers.Authorization = localStorage.getItem('myToken')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 配置axios的通用配置
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('myToken')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
