import request from '@/utils/request'
const mockPrefix = '/mock'

export function getProjectGroup() {
  return request({
    url: 'api/enegyAnalyse/getProjectGroup',
    method: 'get'
  })
}

