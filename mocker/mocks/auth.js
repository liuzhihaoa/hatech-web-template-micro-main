/*
 * @Author: jiangnan
 * @Email: hujiangnan@hatech.com.cn
 * @Date: 2022-01-16 11:36:55
 * @LastEditors: jiangnan
 * @LastEditTime: 2022-01-17 12:14:07
 * @Describle: 描述
 */
// const Mockjs = require('mockjs')
const Jwt = require('jsonwebtoken')
const Menus = require('../data/menu')
const user = {
    id: "123",
    name: 'admin',
    no: 'developer@hatech.com.cn',
    password: '123456'
}

module.exports = {
    '[POST] /api/oauth/user/login': ctx => {
        console.log(ctx.request.params, ctx.request.body, ctx.request.query)
        const { username, password } = ctx.request.body
        if (username !== user.no || password !== user.password) {
            ctx.body = {
                code: 500,
                msg: '账号或密码错误',
                data: null
            }
            return
        }
        ctx.body = {
            code: 200,
            msg: '操作成功',
            data: {
                user_id: user.id,
                access_token: Jwt.sign(user, 'secret', { expiresIn: '2h' })
            }
        }
    },
    // 获取用户信息
    '[get] /api/rbac/user/detail': ctx => {
        const headers = ctx.request.headers
        if (!headers.authorization) {
            ctx.body = {
                code: 401,
                msg: '未授权'
            }
        } else {
            ctx.body = {
                code: 200,
                msg: '操作成功',
                data: user
            }
        }
    },
    // 获取菜单信息
    '[get] /api/rbac/menu/user/menu': ctx => {
        ctx.body = Menus
    },
    // 获取菜单鉴权信息
    '[get] /api/rbac/menu/user/button': ctx => {
        const data = []
        ctx.body = {
            code: 200,
            msg: '操作成功',
            data
        }
    }
}