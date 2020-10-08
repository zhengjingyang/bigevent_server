const joi = require('@hapi/joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()

// 验证规则对象 - 发布文章
exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state,
  },
}


const pagenum = joi.number().integer().min(1).required()
const pagesize = joi.number().integer().min(1).required()
const cate_id_get = joi.string()
const state_get = joi.string()

// 验证规则对象 - 获取文章列表
exports.get_article_schema = {
  query: {
    pagenum,
    pagesize,
    cate_id: cate_id_get,
    state: state_get
  }
}

// 根据Id 删除文章
const id = joi.number().integer().required()
exports.del_article_schema = {
  params: {
    id
  }
}

const Id = joi.number().integer().required()
// 根据Id更新用户信息
exports.update_article_schema = {
  body: {
    Id,
    title,
    cate_id,
    content,
    state
  }
}