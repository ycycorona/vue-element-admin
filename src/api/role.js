import request from '@/utils/request'
const mockPrefix = '/mock'

export function getRoutes() {
  return request({
    url: mockPrefix + '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: mockPrefix + '/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: mockPrefix + '/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: mockPrefix + `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: mockPrefix + `/role/${id}`,
    method: 'delete'
  })
}
