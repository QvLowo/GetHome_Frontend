import axios from 'axios'
import Vue from 'vue'
import user from '../store/modules/user'
import router from '../router'

// axios.defaults.withCredentials = true

// 請求帶的header
//   有開CSRF才開 否則會出錯
// axios.defaults.xsrfCookieName = 'XSRF-TOKEN'
// axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'
// axios.defaults.withXSRFToken = true

// axios.defaults.baseURL = 'http://172.20.10.2:8088'
// axios.defaults.baseURL = 'http://192.168.1.116:8088'
// axios.defaults.baseURL = 'http://127.0.0.1:8088'
// axios.defaults.baseURL = 'http://192.168.0.109:8088'
axios.defaults.baseURL = 'http://localhost:8088'

const request = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
// response filter
request.interceptors.request.use(config => {
  let token = user.state.token
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  // console.log('請求攔截器:', config)
  return config
})

request.interceptors.response.use(response => {
  let res = response.data

  // issue1, res.code is not valid, use response.status
  const code = response.status

  if (code === 200 || code === 201 || code === 204) {
    // issue2: return reponse.data, so initialize can't use response.data
    return response.data
  } else {
    // 權限不足，重導向登入頁面
    if (code === 301 || code === 401) {
      Vue.prototype.$message({message: '沒有權限，請重新登入', type: 'error'})
      router.push('/login')
      return Promise.reject(res.msg)
    }
    if (code === 403) {
      Vue.prototype.$message({message: '請求被拒絕', type: 'error'})
      return Promise.reject(res.msg)
    }
    return Promise.reject(res.msg)
  }
}, error => {
  if (error.toString().indexOf('Network Error') !== -1) {
    Vue.prototype.$message({message: '後端伺服器未啟動', type: 'error'})
    return Promise.reject(error)
  }
  console.error('axios出錯:', error)
  return Promise.reject(error)
})
export default request
