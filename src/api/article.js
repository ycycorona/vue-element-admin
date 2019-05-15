import request from '@/utils/request'
const mockPrefix = '/mock'

export function fetchList(query) {
  return request({
    url: mockPrefix + '/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: mockPrefix + '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: mockPrefix + '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: mockPrefix + '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: mockPrefix + '/article/update',
    method: 'post',
    data
  })
}
