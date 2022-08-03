import { StoreModule } from 'hatech-web-core'
import { CacheUtil } from 'hatech-web-utils'
import { loadMicroApp } from 'qiankun'

import router from '@/router'
import config from '@/config'
import { action } from '@/app'

import services from './service'

/**
 * 应用信息数据仓库
 */
export default new StoreModule({
    namespaced: true,
    state: {
        // 用户信息
        user: CacheUtil.get(`${config.appCode}_USER`) || {},
        // 当前登录用户token
        token: CacheUtil.get(`${config.appCode}_TOKEN`),
        loading: false,
        // 是否已登录
        hasLogin: false,
        // 当前页面信息
        currPage: CacheUtil.getObjcet(`${config.appCode}_CURRPAGE`) || {},
        // 上一路由信息
        prevPage: CacheUtil.getObjcet(`${config.appCode}_PREVPAGE`) || {},
        // 用户菜单
        menus: []
    },
    getters: {
        USER: state => state.user,
        TOKEN: state => state.token,
        LOADING: state => state.loading,
        CURRPAGE: state => state.currPage,
        PREVPAGE: state => state.prevPage,
        MENUS: state => state.menus,
        ROUTES: (state) => {
            const totalMenus = [];
            (function func(dataSource = []) {
                dataSource
                    .filter(menu => menu.code && menu.path)
                    .forEach(menu => {
                        const menuTemplate = menu.template
                        let template = totalMenus.find(tm => menuTemplate === tm.meta.template)
                        if (!template) {
                            template = {
                                path: `/${menuTemplate}`,
                                name: menuTemplate,
                                component: resolve => require([`@/views/${menuTemplate}/index.vue`], resolve),
                                meta: {
                                    template: menuTemplate
                                },
                                children: []
                            }
                            totalMenus.push(template)
                        }
                        const route = {
                            path: menu.path,
                            name: menu.code,
                            params: menu.params,
                            meta: {
                                id: menu.id,
                                path: menu.path,
                                code: menu.code,
                                container: menu.container,
                                microPath: menu.microPath,
                                namespace: menu.namespace,
                            }
                        }
                        // 不是微应用
                        if (!menu.microPath) {
                            route.component = resolve => require([`@/views/${menuTemplate}${menu.path}`], resolve)
                        }

                        template.children.push(route)

                        if (menu.children && menu.children.length) func(menu.children)
                    })
            })(state.menus || []);
            return { totalMenus }
        }
    },
    mutations: {
        // 保存
        save(state, payload) {
            Object.keys(payload).forEach(key => {
                state[key] = payload[key]
            })
        },
        // 登录成功
        LoginSuccess(state, response) {
            const { user_id, access_token } = response.data
            state.hasLogin = true
            state.user = {
                id: user_id
            }
            state.token = `Bearer ${access_token}`
            CacheUtil.save(`${config.appCode.toUpperCase()}_TOKEN`, state.token)
            CacheUtil.saveObject(`${config.appCode.toUpperCase()}_USER`, state.user)
        },
        // 获取路由权限中第一条可行的路由
        GoToFirstRoute(state) {
            let route;
            const getRoute = (list) => {
                if (route) return
                if (!list) return
                if (Array.isArray(list)) {
                    if (list.length === 0) return
                    list.forEach(getRoute)
                } else if (toString.apply(list) === '[object Object]') {
                    if (list.isShow !== 1) return

                    if (list.children && list.children.length > 0 && list.children.some(item => item.isShow === 1)) {
                        return getRoute(list.children.find(item => item.isShow === 1))
                    } else {
                        route = list
                    }
                }
            }
            getRoute(state.menus)

            if (route && route.path) {
                router.replace({
                    path: route.path
                })
            }
        },
        // 加载微应用
        LoadMicroApp(state) {
            const { path, microPath, code, container, namespace } = state.currPage.meta
            if (!microPath) return

            if (router.currentRoute.name !== code) {
                router.push({ path })
            }

            const containerElement = document.querySelector(container)
            if (!containerElement) return
             // 因为在 菜单管理里面 微应用路径 配置的格式是 ${host}/xx/xx/xx 
            const entry = microPath.replace('${host}', location.origin) // 将 ${host} 替换成当前的 origin

            const load = () => {
                state.currMicroApp = loadMicroApp({
                    name: code,
                    entry: entry,
                    container: containerElement,
                    props: {
                        router,
                        token: state.token,
                        code,
                        namespace: namespace,
                        onGlobalStateChange: action.onGlobalStateChange,
                        setGlobalState: action.setGlobalState
                    }
                })
            }
             // 存在并且当前的状态是已安装的时候再卸载，因为，如果挂载页面的地址如果是错误的也会有currMicroApp对象
            if (state.currMicroApp  && state.currMicroApp.getStatus() === 'MOUNTED') {
                state.currMicroApp.unmount().then(load)
            } else {
                load()
            }
        },
        // 保存上一路由信息
        SavePrev(state, prevPage) {
            state.prevPage = prevPage
            CacheUtil.saveObject(`${config.appCode}_PREVPAGE`, prevPage)
        },
        // 保存当前路由信息
        SaveCurrPage(state, currPage) {
            state.currPage = currPage
            CacheUtil.saveObject(`${config.appCode}_CURRPAGE`, currPage)
        },
        // 保存菜单，注入路由
        SaveMenus(state, menus) {
            state.menus = menus
            if (menus && menus.length > 0) {
                const { totalMenus } = this.getters['app/ROUTES']
                router.addRoutes(totalMenus)
            }
        },
        // 注销成功
        Logout(state) {
            state.user = {}
            state.hasLogin = false
            state.token = undefined;
            ['TOKEN', 'USER'].forEach(key => {
                CacheUtil.remove(`${config.appCode}_${key}`)
            })
        }
    },
    actions: {
    },
    services
})