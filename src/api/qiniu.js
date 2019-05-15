import request from '@/utils/request'
const mockPrefix = '/mock'

export function getToken() {
  return request({
    url: mockPrefix + '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}
