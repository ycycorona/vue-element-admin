import request from '@/utils/request'
// const mockPrefix = '/mock'

export function getProjectGroup() {
  return request({
    url: 'api/enegyAnalyse/getProjectGroup',
    method: 'get'
  })
}

export function getProjectGrouplight() {
  return request({
    url: 'api/enegyAnalyse/getProjectGrouplight',
    method: 'get'
  })
}

export const backEndBase = 'http://47.92.126.243:8080/light2/'
export const proName = 'light2'

