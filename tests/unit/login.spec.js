import Login from '@/views/login/index.vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'


// 模拟依赖
jest.mock('hatech-web-component-screen', () => ({
    render(h) {
        h();
    }
}))
jest.mock('hatech-web-component-login', () => ({
    render(h) {
        h();
    }
}))

describe('Login Page', () => {
    let store
    let localVue
    let actions
    beforeEach(() => {
        localVue = createLocalVue()
        localVue.use(Vuex)
        actions = {
            Login: jest.fn()
        }
        store = new Vuex.Store({
            state: {},
            modules: {
                app: {
                    namespaced: true,
                    actions
                }
            }
        })
    })

    it('page render', () => {
        const wapper = mount(Login, {
            localVue,
            store,
            stubs: ['hatech-login', 'hatech-screen'],
        })
        expect(wapper.find('.login-page').element.nodeName).toBe('DIV')
    })

    it('screen', () => {
        const wapper = mount(Login, {
            localVue,
            store,
            stubs: ['hatech-login', 'hatech-screen'],
        })
        expect(wapper.vm.showScreen).toBe(true)
        wapper.vm.onClickScreen()
        expect(wapper.vm.showScreen).toBe(false)
    })

    it('login', async () => {
        const wapper = mount(Login, {
            localVue,
            store,
            stubs: ['hatech-login', 'hatech-screen'],
        })
        await wapper.vm.onLogin({ userName: 'admin', passWord: 'admin' })
        expect(actions.Login).toHaveBeenCalled()
    })
})