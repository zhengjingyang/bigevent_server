const joi = require('@hapi/joi')

const name = joi.string().required().min(1).max(50)
const alias = joi.string().alphanum().required().min(1).max(50)
// 分类id的校验规则
const id = joi.number().integer().min(1).required()

// 添加分类
exports.addcates_schema = {
  body: {
    name,
    alias
  }
}
// 删除分类 
exports.delete_cates_schema = {
  params: {
    id
  },
}

// 更新分类
exports.update_cate_schema = {
  body: {
    Id: id,
    name,
    alias
  }
}