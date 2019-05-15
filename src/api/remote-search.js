import request from '@/utils/request'
const mockPrefix = '/mock'

export function searchUser(name) {
  return request({
    url: mockPrefix + '/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: mockPrefix + '/transaction/list',
    method: 'get',
    params: query
  })
}
