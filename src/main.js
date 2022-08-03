import { Vue, RequestEvents, HTTPRequestManager, HTTPServiceFeature } from 'hatech-web-core'
import Element from 'hatech-element-ui'
import Utils, { FileUtil } from 'hatech-web-utils'
import HatechIcon from 'hatech-web-component-icon'
import ThemeLoader from 'hatech-web-theme-loader'
import ThemeDarkblue from 'hatech-web-theme-darkblue'
import ThemeWhite from 'hatech-web-theme-white'
import 'hatech-element-ui/lib/theme-chalk/index.css'

import './assets/icons'

import { core } from './app'

// 加载主题
Vue.use(ThemeLoader, {
  defaultTheme: ThemeWhite,
  themes: [
    ThemeDarkblue,
    ThemeWhite
  ]
})
// 绑定工具集
Vue.use(Utils)
// 使用图标组件
Vue.use(HatechIcon)
// 使用ElementUI
Vue.use(Element)

// 请求失败 
HTTPRequestManager.registerEvent(RequestEvents.onRespondFail, ({ result }) => {
  if (!result.success) {
    core.vue.$message.error(result.msg)
  }
})

// 请求成功
HTTPRequestManager.registerEvent(RequestEvents.onRespondSuccess, ({ response, service }) => {
  if (response && response.success) {
    // 处理下载文件
    if (service.feature & HTTPServiceFeature.isDownload) {
      FileUtil.downBinary(response.data)
    }
  }
})

