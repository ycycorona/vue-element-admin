import request from '@/utils/request'
const mockPrefix = '/mock'
export function login(data) {
  return request({
    url: '/api/login/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: mockPrefix + '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: mockPrefix + '/user/logout',
    method: 'post'
  })
}
