const express = require('express')
const router = express.Router()

// 导入路由处理模块
const artcate_handler = require('../router_handler/artcate')
// 导入数据验证模块
const expressJoi = require('@escook/express-joi')
const { addcates_schema, delete_cates_schema, update_cate_schema } = require('../schema/artcate')

// 获取文章分类列表
router.get('/cates', artcate_handler.getArtcate)
// 新增文章分类
router.post('/addcates', expressJoi(addcates_schema), artcate_handler.addCates)
// 根据Id删除文章分类
router.get('/deletecate/:id', expressJoi(delete_cates_schema), artcate_handler.deleteCates)
// 根据Id获取文章分类的数据
router.get('/cates/:id', expressJoi(delete_cates_schema), artcate_handler.getArtcateId)
// 根据Id更新文章分类数据
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCate)

module.exports = router