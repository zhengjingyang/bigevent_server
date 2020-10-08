const express = require('express')
const app = express();
app.listen(3007, () => console.log('running'))

const joi = require('@hapi/joi')

// 解决跨域
var cors = require('cors')
app.use(cors())
// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))
// 封装res.cc函数
app.use((req, res, next) => {
  // status默认值1 表示失败的情况
  // err的值可能是错误对象 也可能是字符串 
  res.cc = function (err, status = 1) {
    res.send({
      status,
      // 状态描述 判断err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})
// 在路由之前配置解析token的中间件
const expressJWT = require('express-jwt')
// 导入配置文件
const config = require('./config')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))


// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 导入并使用 用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
// 导入并使用 文章分类路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)
// 导入并使用 文章路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)



// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 数据验证失败的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败导致的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
  // 未知的错误
  res.cc(err)
})