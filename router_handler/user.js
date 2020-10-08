// 在这里定义和用户相关的路由处理函数 供/router/user.js模块进行调用

// 导入数据库操作模块
const db = require('../db/index')
// 导入bcryptjs
const bcrypt = require('bcryptjs')
// 导入生成token的包
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

// 注册用户的处理函数
exports.reguser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body
  // 1、对表单中的数据进行合法性校验
  // if (!userinfo.username || !userinfo.password) {
  //   // return res.send({ status: 1, message: '用户名或密码不合法' })
  //   return res.cc('用户名或密码不合法')
  // }
  // 2、检测用户名是否被占用
  db.query('select * from ev_users where username = ?', userinfo.username, (err, results) => {
    if (err) {
      // return res.send({ status: 1, message: err.message })
      return res.cc(err)
    }
    // 判断用户名是否被占用
    if (results.length > 0) {
      // return res.send({ status: 1, message: '用户名被占用' })
      return res.cc('用户名被占用')
    }
    // 3、密码加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    // 4、插入新用户
    db.query('insert into ev_users set ?', { username: userinfo.username, password: userinfo.password }, (err, results) => {
      if (err) {
        // return res.send({ status: 1, message: err.message })
        return res.cc(err)
      }
      if (results.affectedRows !== 1) {
        // return res.send({ status: 1, message: '注册失败' })
        return res.cc('注册失败')
      }
      // res.send({ status: 0, message: '注册成功' })
      res.cc('注册成功', 0)
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  // res.send('login ok')
  const userinfo = req.body
  // 1、判断用户名是否存在
  db.query('select * from ev_users where username = ?', userinfo.username, (err, results) => {
    // console.log(results);
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('登录失败！')
    // 2、判断密码是否正确
    // 拿着用户输入的密码,和数据库中存储的密码进行对比
    const compareReslt = bcrypt.compareSync(userinfo.password, results[0].password)
    // 如果对比的结果等于false 证明用户输入的密码错误
    if (!compareReslt) return res.cc('登录失败！')

    // 3、生成token字符串
    // 剔除密码和头像
    const user = { ...results[0], password: '', user_pic: '' }
    // 对用户信息进行加密 生成token
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    res.send({
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr
    })
  })

}