import request from '../utils/request'

export function houseInfo (query) {
  return request({
    url: '/public/houses',
    method: 'get',
    params: query
  })
}

export function getHouse (id) {
  return request({
    url: '/public/houses/' + id,
    method: 'get'
  })
}

export function addHouse (userId, data) {
  return request({
    url: '/landlords/' + userId + '/house',
    method: 'post',
    data: data
  })
}

export function updateHouse (id, data) {
  return request({
    url: '/landlords/house/' + id,
    method: 'put',
    data: data
  })
}

export function deleteHouse (id) {
  return request({
    url: '/landlords/house/' + id,
    method: 'delete'
  })
}
