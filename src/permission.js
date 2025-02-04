import router from './router'
import user from './store/modules/user'
import Vue from 'vue'
import store from './store'

router.beforeEach((to, from, next) => {
  let token = user.state.token
  if (to.path === '/login') {
    next({ path: '/index' })
  } else {
    // 沒有token,重導向至登入頁
    if (!token) {
      next('/login')
    } else {
      let res = store.dispatch('getAuth')
      console.log('getAuth', res)
      res.then((noAuth) => {
        // 如果不需要驗證直接放行
        if (!to.meta.auth) {
          next()
        } else if (noAuth.indexOf(to.meta.auth) !== -1) {
          // 如果登入有權限放行
          next()
        } else {
          // 如果都沒有回去首頁
          Vue.prototype.$message({message: '您沒有權限，即將回到首頁', type: 'error'})
          setTimeout(() => {
            next('/index')
          }, 100)
        }
      })
    }
  }
})
router.afterEach((to, from) => {
  // 後置
})
