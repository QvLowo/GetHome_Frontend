import request from '../utils/request'

export function signUp (roleId, data) {
  return request({
    method: 'post',
    url: '/public/sign-up/' + roleId,
    data: data
  })
}

export function userInfo (id) {
  return request({
    method: 'post',
    url: '/public/users',
    data: id
  })
}

// token查詢
export function getUserInfo () {
  return request({
    method: 'post',
    url: '/public/users/userInfo'
  })
}

// token取得權限
export function getAuth (data) {
  return request({
    method: 'post',
    url: '/public/users/Auth',
    data: data
  })
}
