/* 
* 用户信息的路由处理函数
*/

// 导入数据库操作模块
const db = require('../db/index')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')

// 获取用户基本信息
exports.getUserInfo = (req, res) => {
  const sql = 'select id,username,nickname,email,user_pic from ev_users where id = ?'
  db.query(sql, req.user.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取用户信息失败')
    res.send({
      status: 0,
      message: '获取用户信息成功',
      data: results[0]
    })
  })
}

// 更新用户基本信息
exports.updateUserInfo = (req, res) => {
  const sql = 'update ev_users set ? where id = ?'
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('修改用户信息失败')
    res.cc('修改用户信息成功', 0)
  })
}

// 重置密码
exports.updatePwd = (req, res) => {
  console.log(req.user);
  // 1、根据id查询用户的信息
  db.query('select * from ev_users where id = ?', req.user.id, (err, results) => {
    console.log(results);
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('用户不存在')
    // 2、判断旧密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    if (!compareResult) return res.cc('原密码错误')
    // 3、更新密码
    // 对新密码进行加密
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    db.query('update ev_users set password = ? where id = ?', [newPwd, req.user.id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('修改密码失败')
      res.cc('修改密码成功', 0)
    })
  })
}

// 修改头像
exports.updateAvatar = (req, res) => {
  db.query('update ev_users set user_pic = ? where id = ?', [req.body.avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('修改头像失败')
    res.cc('修改头像成功', 0)
  })
}