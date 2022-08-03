import Main from '@/views/main/index.vue'
import { shallowMount } from '@vue/test-utils'
import { Store } from 'hatech-web-core'

jest.mock('hatech-web-layout-husmc', () => ({
    render(h) {
        h()
    }
}))


describe('Main Page', () => {
    // let vue
    let store
    beforeEach(function () {
        // vue = createLocalVue()
        // vue.use(VueRouter)
        // vue.use(Vuex)
        // vue.use(HatechLayout)
        store = new Store({
            modules: {
                app: {
                    namespaced: true,
                    getters: {
                        LOADING: () => false,
                        CURRPAGE: () => ({
                            meta: {}
                        }),
                        MENUS: () => [],
                        USER: () => ({
                            userName: 'username'
                        })
                    },

                }
            }
        })
        // vue.prototype.$store = store
    })

    afterEach(function () {
        store = null
    })

    it('render', () => {
        const wapper = shallowMount(Main, {
            store,
            stubs: ['hatech-layout'],
            mocks: {
                $theme: {
                    themes: []
                }
            }
        })
        expect(wapper.find('.content').element.style.display).toBe('none')
        expect(wapper.find('#container').element.id).toBe('container')
    })

    // it('onEvent', () => {
    //     const $router = {
    //         push: jest.fn()
    //     }
    //     const wapper = shallowMount(Main, {
    //         // localVue: vue,
    //         store,
    //         stubs: ['hatech-layout'],
    //         mocks: {
    //             $theme: {
    //                 themes: []
    //             },
    //             $router
    //         }
    //     })
    //     wapper.vm.onEvent({
    //         event: 'onClickMainMenu',
    //         params: {
    //             menu: 'MENU',
    //             collapse: true
    //         }
    //     })

    //     expect(wapper.vm.currMenu).toBe('MENU')
    //     expect(wapper.vm.showSider).toBe(true)
    //     // expect($router.push).toBeCalled()
    // })
})