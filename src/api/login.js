import request from '../utils/request'

export function login (data) {
  return request({
    method: 'post',
    url: '/public/login',
    data: data
  })
}

export function googleAuth () {
  return request({
    method: 'get',
    url: '/public/OAuth2/google/buildAuthUrl'
  })
}

export function getGoogleToken (code) {
  return request({
    method: 'post',
    url: '/public/OAuth2/google/exchangeToken',
    data: code
  })
}

export function getGoogleUser (token) {
  return request({
    method: 'get',
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
}

export function getCodeImg () {
  return request({
    method: 'get',
    url: '/public/code'
  })
}
