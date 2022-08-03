import { Core } from 'hatech-web-core'
import router from './router'
import config from './config'
import store from './store'
import App from './App.vue'
import { addGlobalUncaughtErrorHandler, initGlobalState } from 'qiankun'
import { QKEvents, QKAction } from 'hatech-qiankun'

let core

const render = ({
    content = '',
    loading = true
} = {}) => {
    if (core) {
        core.vue.content = content
        core.vue.loading = loading
    } else {
        core = new Core({
            code: config.appCode,
            store,
            router,
            render: h => h(App, {
                content,
                loading
            }),
        })
        core.vue.$mount('#app')
    }
}

// 处理微应用错误
addGlobalUncaughtErrorHandler(event => {
    store.state.app.loading = false
    console.log('微前端异常 : ', event)
})

// 监听应用事件
const action = initGlobalState(QKAction)
action.onGlobalStateChange(({ type, payload }) => {
    // 登录成功
    if (type === QKEvents.LOGIN_SUCCESSED) {
        store.dispatch('app/LoginSuccess', payload)
    } else if (type === QKEvents.PUSH_ROUTE) {
        // push路由
        router.push(payload)
    } else if (type === QKEvents.REDIRECT_ROUTE) {
        // 重定向路由
        router.redirect(payload)
    }
})

render()

export { core, action }