/*
 * @Author: zhoujingrong
 * @Date: 2021-02-07 20:11:43
 * @LastEditors: zhoujingrong
 * @LastEditTime: 2021-02-18 17:18:54
 * @description: 
 */
import { HTTPService, HTTPMethod, HTTPServiceFeature } from 'hatech-web-core'

const { GET, POST } = HTTPMethod
const { useToken } = HTTPServiceFeature

/**
 * 接口由HTTPService对象创建
 */
export default [
  // 登录
  new HTTPService({
    name: 'Login',
    url: '/api/oauth/user/login',
    method: POST,
    defaultParams: {
      fromSource: 'operate'
    },
    afterResponse: async ({ commit, dispatch }, response) => {
      if (response && response.success) {
        // 保存用户信息和token
        commit('LoginSuccess', response)
        await dispatch('FetchUserByToken')
        await dispatch('FetchMenus')
      }
      return response
    }
  }),
  // 获取用户菜单
  new HTTPService({
    name: 'FetchMenus',
    url: '/api/rbac/menu/user/menu',
    method: GET,
    feature: useToken,
    defaultParams: {
      systemFlag: 'oauth',
      systemType: 'oauth_operate'
    },
    afterResponse: ({ commit }, response) => {
      if (response && response.success) {
        if (response.data && response.data.length > 0) {
          // 获取用户菜单后进行保存
          commit('SaveMenus', response.data[0].children)
        }
      }
      return response
    }
  }),
  // 通过token获取用户信息
  new HTTPService({
    name: 'FetchUserByToken',
    url: '/api/rbac/user/detail',
    method: GET,
    feature: useToken,
    afterResponse: ({ commit }, response) => {
      if (response && response.success) {
        // 保存用户信息
        commit('Save', { user: response.data, hasLogin: true })
      }
      return response
    }
  }),
  // 修改密码
  new HTTPService({
    name: 'ChangePwd',
    url: '/api/rbac/user/password/change',
    method: POST,
    feature: useToken,
  }),
  // 查询菜单鉴权信息
  new HTTPService({
    name: 'FetchAuthsOfPage',
    url: '/api/rbac/menu/user/button',
    method: GET,
    feature: useToken
  }),
  new HTTPService({
    name: 'FetchRoles',
    url: '/api/rbac/user/role-id-name',
    method: GET,
    feature: useToken
  })
]
