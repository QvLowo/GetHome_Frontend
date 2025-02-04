import request from '../utils/request'

export function createPayment (data) {
  return request({
    method: 'post',
    url: '/tenants/payments/request',
    data: data
  })
}

export function checkPayment (rentId, data) {
  return request({
    method: 'post',
    url: '/tenants/payments/confirm/' + rentId,
    data: data
  })
}
