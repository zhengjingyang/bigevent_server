const express = require('express')
const router = express.Router()

// 导入路由处理文件
const article_handler = require('../router_handler/article')
// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 导入数据验证模块
const expressJoi = require('@escook/express-joi')
const { add_article_schema, get_article_schema, del_article_schema, update_article_schema } = require('../schema/article')


// 发布文章
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)
// 获取文章列表数据
router.get('/list', expressJoi(get_article_schema), article_handler.getArticle)
// 根据 Id 删除文章数据
router.get('/delete/:id', expressJoi(del_article_schema), article_handler.delArticle)
// 根据 Id 获取文章详情
router.get('/:id', expressJoi(del_article_schema), article_handler.getArticleInfo)
// 根据Id更新文章信息
router.post('/edit', upload.single('cover_img'), expressJoi(update_article_schema), article_handler.updateArticle)


module.exports = router