const db = require("../database/db")

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize

  const Permission = db.defineModel(app, "system_permission", {
    title: STRING, // 标题
    url: STRING, // 路由连接
    status: { type: INTEGER, defaultValue: "1" }, //  用户状态： 0:禁用, 1:启用

  })

  // User.hasMany(Article, {as: 'articlesss'})
  return Permission
}