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

/**
 * 登出
 * @param {*} token
 */
export function logout(token) {
  return request({
    url: '/api/login/logout',
    method: 'post',
    data: { token: token }
  })
}
