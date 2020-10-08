// 导入joi来验证规则
const joi = require('@hapi/joi')

// 定义 id, nickname, emial 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()
// 密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
// 头像的验证规则
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()

// 更新用户信息表单的验证规则对象
exports.update_userinfo_schema = {
  body: {
    id,
    nickname,
    email
  }
}

// 更新密码表单的验证规则对象
exports.update_pwd_schema = {
  body: {
    oldPwd: password,
    // 解读：
    // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
    // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
    // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
    newPwd: joi.not(joi.ref('oldPwd')).concat(password),
  }
}

// 更换头像表单验证规则对象
exports.update_avatar_schema = {
  body: {
    avatar
  }
}
