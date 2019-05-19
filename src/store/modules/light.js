import { getProjectGroup } from '@/api/light/common'

const state = {
  projectGroup: []
}

const mutations = {
  projectGroupSet: (state, data) => {
    state.projectGroup = data
  }
}

const actions = {
  /**
   * @desc 获取项目分组数据
   * @param {*} param0
   */
  reqProjectGroup({ commit }) {
    return new Promise((resolve, reject) => {
      getProjectGroup().then(response => {
        commit('projectGroupSet', response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  /**
   * @desc 获取通用数据
   * @param {*} param0
   */
  reqCommonData({ dispatch }) {
    return new Promise((resolve, reject) => {
      dispatch('reqProjectGroup').then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
