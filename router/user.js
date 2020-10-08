const express = require('express')
// 创建路由模块
const router = express.Router()

// 导入用户路由处理函数模块
const uesrHandle = require('../router_handler/user')
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')

// 注册
router.post('/reguser', expressJoi(reg_login_schema), uesrHandle.reguser)
// 登录
router.post('/login', expressJoi(reg_login_schema), uesrHandle.login)

// 将路由对象共享出去
module.exports = router