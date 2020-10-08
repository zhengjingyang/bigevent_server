
// 导入处理路径的 path 核心模块
const path = require('path')
// 导入db模块
const db = require('../db/index')
// 导入时间模块
const moment = require('moment')


// 添加文章
exports.addArticle = (req, res) => {
  // 判断客户端是否提交了 封面图片
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
  // console.log(req.body) // 文本类型的数据
  // console.log('--------分割线----------')
  // console.log(req.file) // 文件类型的数据
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章发布时间
    pub_date: moment().format('YYYY-MM-DD hh:mm:ss'),
    // 文章作者的Id
    author_id: req.user.id,
  }
  const sql = 'insert into ev_articles set ?'
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('文章添加失败')
    res.cc('文件添加成功', 0)
  })
}

// 获取文章列表数据
exports.getArticle = (req, res) => {
  let { pagenum, pagesize } = req.query //解构赋值 pagenum:页码值 pagesize:每页显示多少条数据
  let sql = `select ea.Id,ea.title,ea.content,ea.pub_date,ec.name as cate_name from ev_articles as ea left join ev_article_cate as ec on ea.cate_id = ec.Id where ea.author_id = ${req.user.id} and ea.is_delete = 0 limit ${(pagenum - 1) * pagesize},${pagesize}`
  // let sql = `select * from ev_articles where author_id = ${req.user.id} limit ${(pagenum - 1) * pagesize},${pagesize}`
  let sql_count = `select count(*) as totle from ev_articles where author_id = ${req.user.id} and is_delete = 0`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    db.query(sql_count, (e, r) => {
      if (e) return res.cc(e)
      res.send({
        status: 0,
        message: '文章列表获取成功',
        data: results,
        totle: r[0].totle
      })
    })
  })
}

// 根据 Id 删除文章数据
exports.delArticle = (req, res) => {
  db.query('update ev_articles set is_delete = 1 where id = ?', req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除文章失败')
    res.cc('删除文章成功', 0)
  })
}

// 根据 Id 获取文章详情
exports.getArticleInfo = (req, res) => {
  db.query('select * from ev_articles where id = ?', req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取文章详情失败')
    res.send({
      status: 0,
      message: '获取文章详情成功',
      data: results[0]
    })
  })
}

// 根据Id更新文章信息
exports.updateArticle = (req, res) => {
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
  const articleInfo = {
    ...req.body,
    cover_img: path.join('/uploads', req.file.filename),
    pub_date: moment().format('YYYY-MM-DD hh:mm:ss'),
  }
  const sql = 'update ev_articles set ? where Id = ?';
  db.query(sql, [articleInfo, req.body.Id], (err, results) => {
    if (err) return res.cc(err)
    console.log(results);
    if (results.affectedRows !== 1) return res.cc('更新文章信息失败')
    res.cc('更新文章信息成功', 0)
  })
}
