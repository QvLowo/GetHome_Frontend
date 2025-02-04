import request from '../utils/request'

export function createRent (userId, data) {
  return request({
    method: 'post',
    url: '/tenants/' + userId + '/rent',
    data: data
  })
}

export function payRent (rentId, data) {
  return request({
    method: 'post',
    url: '/tenants/rent/' + rentId,
    data: data
  })
}

export function getRentOrder (query) {
  return request({
    method: 'get',
    url: '/api/rents',
    params: query
  })
}

export function getRentInfo (query) {
  return request({
    method: 'get',
    url: '/api/rent/info',
    params: query
  })
}

export function getRent (rentId) {
  return request({
    method: 'get',
    url: '/api/rent/' + rentId
  })
}

export function getRentInfoById (rentInfoId) {
  return request({
    method: 'get',
    url: '/api/rent/info/' + rentInfoId
  })
}

export function endLease (rentId) {
  return request({
    method: 'put',
    url: '/tenants/rent/' + rentId,
    data: rentId
  })
}

export function checkEndLease (data) {
  return request({
    method: 'put',
    url: '/landlords/rent',
    data: data
  })
}
