import {login} from '../../api/login'
import {getAuth, getUserInfo} from '../../api/user'
import {getToken, removeToken, setToken, setUserId} from '../../utils/auth'
import Cookies from 'js-cookie'

const user = {
  // 保管所有組件的公共資料
  state: {
    token: getToken(),
    name: '',
    id: '',
    auth: ''
  },
  // 同步改變state
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME (state, name) {
      state.name = name
    },
    SET_AUTH (state, auth) {
      state.auth = auth
    },
    SET_USER_ID (state, userId) {
      state.id = userId
    },
    CLEAR_USER (state) {
      state.id = ''
      state.token = ''
      state.name = ''
      state.auth = ''
    }
  },
  // 非同步執行mutations方法
  actions: {
    async Login ({commit}, data) {
      try {
        let res = await login(data)
        if (res) {
          console.log('resData', res)
          let code = res.code
          let msg = res.msg
          let data = res.data
          console.log('res', code)
          if (code === '200') {
            this.token = data
            setToken(data)
            commit('SET_TOKEN', data)
            return 'ok'
          } else {
            return Promise.reject(Error(msg))
          }
        } else {
          return Promise.reject(Error('帳號密碼錯誤'))
        }
      } catch (error) {
        return Promise.reject(Error(error.msg))
      }
    },
    async userInfo ({commit}) {
      try {
        let res = await getUserInfo()
        commit('SET_NAME', res.data.userName)
        setUserId(res.data.userId)
        commit('SET_USER_ID', res.data.userId)
        console.log('res', res)
      } catch (error) {
        console.error('取得使用者資料失敗:', error)
      }
    },
    async getAuth ({commit}) {
      try {
        let res = await getAuth()
        console.log('auth', res)
        commit('SET_AUTH', res.data[0])
        return res.data
      } catch (error) {
        console.error('取得使用者權限失敗:', error)
      }
    },
    logout ({commit}) {
      commit('CLEAR_USER')
      removeToken()
      Cookies.remove('name')
      Cookies.remove('id')
      Cookies.remove('email')
    }
  },
  // 監聽state變化
  getters: {}
}
export default user
