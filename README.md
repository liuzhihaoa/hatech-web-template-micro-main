# 同创微前端主项目模板

此项目模板集成Vue、VueRouter、Vuex、HTTP请求、基础布局、DarkBlue主题。主题需要在main.js中集成可切换的主题

## 使用说明

* Vue
  Vue已默认集成
* VueRouter
* Vuex
* 主题
  主题是由一系统的css变量组成的样式包，可安装已开发的主题样式依赖，并注入到主题加载器中使用。如没有符合需要的主题包，可通过主题模板创建合适的主题。
* 布局
  基础布局默认使用的hatech-web-layout-hmusmc，集成了头部Logo、菜单栏、用户信息、用户菜单，侧边菜单栏以及内容区域。如需使用别的样式，可在App.vue中替换相应的的依赖，自定义布局可使用布局模板。
* Mock服务
* 接口配置



## 功能说明

### 	菜单配置说明

code:微应用的名称，微应用之间必须确保唯一

`microPath` ：对应qiankun entry属性，即为子应用的真实访问路径。通过此路径可以加载到子应用的资源。

`container`: 微应用的容器节点的选择器或者元素 实例。

`isShow`: 此路由是否显示在菜单上。0不显示，1显示。

`path`:表示访问路径。

```
 {
          "children": null,
          "code": "monitor_home",
          "container": null,
          "createTime": null,
          "createUserId": null,
          "editTime": null,
          "editUserId": null,
          "icon": "home",
          "id": "18fc05b93820a89751d44e193c6d57a9",
          "isDelete": null,
          "isShow": 1,
          "level": 3,
          "menuName": "首页",
          "microPath": null,
          "namespace": null,
          "operationIds": null,
          "orderInfo": 10,
          "parentId": "77792aa6ebf611e99752005056a62b81",
          "parentMenuName": "开源监控菜单",
          "path": "/menu/home",
          "systemFlag": null,
          "template": "main"
        },
```

## 实现思路

​	

```
 const totalMenus = []
      ;(function func(dataSource = []) {
        dataSource
          .filter((menu) => menu.code && menu.path)
          .forEach((menu) => {
            const menuTemplate = menu.template
            let template = totalMenus.find(
              (tm) => menuTemplate === tm.meta.template
            )
            if (!template) {
              template = {
                path: `/${menuTemplate}`,
                name: menuTemplate,
                component: (resolve) =>
                  require([`@/views/${menuTemplate}/index.vue`], resolve),
                meta: {
                  template: menuTemplate,
                },
                children: [],
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
              },
            }
            // 不是微应用
            if (!menu.microPath) {
              route.component = (resolve) =>
                require([`@/views/${menuTemplate}${menu.path}`], resolve)
            }

            template.children.push(route)

            if (menu.children && menu.children.length) func(menu.children)
          })
      })(state.menus || [])
      return { totalMenus }
```

​	微前端环境下，主应用管理所有的路由，主应用通过props将路由实例传给子应用。子应用的路由配置只需要name属性和主应用菜单中对用路由的code属性一致就行。

```
子应用路由配置：
{
    path: "/page3",
    name: "page1",
    label: "页面1",
    component: Page1
  }
```



示例：
 子应用的routes:

  ```
  export default [
    {
      path: '/system',
      name: 'monitoring_system',
      label: '操作系统',
      component: monitoringSystem
    }
  ]
  ```

子应用的部署地址： http://192.168.1.101/app/host

补充：在生产环境中，主应用中配置微应用entry(微应用真实访问地址)中的英文路径应和子应用的publicPath一致。

那么 

'微应用路径' 的配置 应该是 http://192.168.1.101/app/host 

这里如果有多个子应用,并且和主应用都部署在同一个地址下，建议使用通配的方式 ${host}，然后在 `/src/store/app/index.js` 里面,将 ${host} 替换成相应的地址

```
            
// 因为在 菜单管理里面 微应用路径 配置的格式是 ${host}/xx/xx/xx  ,所以这里将 ${host}修改为具体的host
const entry = microPath.replace('${host}', location.origin)

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
```

'菜单编码' 的配置 应该是 `monitoring_system` 和 routes 里面对应的name一致

'菜单路由' 表示的是页面上展示的url地址,可以和子应用的path一致 `/system` ,也可以自定义 `/linux/system`

**如果使用了自定义的方式,在代码里面使用path跳转的时候,就需要用自定义的路由,不能使用routes里面的**