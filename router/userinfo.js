const express = require('express')
const router = express.Router()

// 导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')
// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { update_userinfo_schema, update_pwd_schema, update_avatar_schema } = require('../schema/userinfo')


// 获取用户基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)
// 更新用户基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
// 重置密码
router.post('/updatepwd', expressJoi(update_pwd_schema), userinfo_handler.updatePwd)
// 修改头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

module.exports = router