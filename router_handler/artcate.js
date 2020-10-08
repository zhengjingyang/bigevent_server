
const db = require('../db/index')
const { report } = require('../router/user')

// 获取文章分类列表
exports.getArtcate = (req, res) => {
  db.query('select * from ev_article_cate where is_delete=0 order by id asc', (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章分类成功',
      data: results
    })
  })
}

// 新增文章分类
exports.addCates = (req, res) => {
  // 1、查询分类名称或别名 有没有被占用
  const sql = 'select * from ev_article_cate where name = ? or alias = ?'
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    if (err) return res.cc(err)
    // if (results.length !== 0) return res.cc('分类名称或别名已存在')
    // 分类名称 和 分类别名 都被占用
    if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
    // 分类名称 或 分类别名 被占用
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

    // 2、插入文章分类
    db.query('insert into ev_article_cate set ?', req.body, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('新增文章分类失败')
      res.cc('新增文章分类成功', 0)
    })
  })
}

// 删除文章分类
exports.deleteCates = (req, res) => {
  const sql = 'update ev_article_cate set is_delete = 1 where id = ?'
  // console.log(req.params);{ id: 3 }
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除文章分类失败')
    res.cc('删除文章分类成功', 0)
  })
}

// 根据Id获取文章分类数据
exports.getArtcateId = (req, res) => {
  const sql = 'select * from ev_article_cate where id = ?'
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取文章分类数据失败')
    res.send({
      status: 0,
      message: '获取文章分类数据成功',
      data: results[0]
    })
  })
}

// 根据Id更新文章分类数据
exports.updateCate = (req, res) => {
  const sql = 'update ev_article_cate set ? where Id = ?'
  db.query(sql, [req.body, req.body.Id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新文章分类数据失败')
    res.cc('更新文章分类数据成功', 0)
  })
}