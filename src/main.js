import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import Vuex from 'vuex'
import store from './store'
// import Element from 'element-ui'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import axios from 'axios'
import Message from './components/message'

Vue.use(Message)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Vuetify)

axios.defaults.withCredentials = true
// axios全域調用
Vue.config.productionTip = false

// Vue.use(Element, {
//   size: 'medium'
// })

new Vue({
  el: '#app',
  router,
  store,
  // 渲染
  render: h => h(App),
  vuetify: new Vuetify({
    theme: {
      dark: false
    },
    icons: {
      iconfont: 'mdi'
    }
  })
}).$mount('#app')
