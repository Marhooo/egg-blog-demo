const db = require("../database/db")

module.exports = app => {
  const { STRING, INTEGER, BOOLEAN, TEXT } = app.Sequelize

  const Article = db.defineModel(app, "articles", {
    title: { type: STRING, allowNull: false }, // 标题
    describe: STRING, // 文章描述
    article_label: TEXT("long"),
    top: {
      type: BOOLEAN,
      defaultValue: false,
    }, // 是否置顶
    content_html: TEXT("long"), // html格式内容
    content_type: {
      type: STRING,
      defaultValue: 'richText'
    },  //文章主体内容格式。默认为富文本、Markdown
    author: {
      type: STRING,
      allowNull: false,
    }, // 作者
    read_num: {
      type: INTEGER,
      defaultValue: 0,
    }, // 阅读数
    comment_num: {
      type: INTEGER,
      defaultValue: 0,
    }, // 评论数
    praise_num: {
      type: INTEGER,
      defaultValue: 0,
    }, //  点赞数
    thumbnail: STRING, // 缩略图
    banner: STRING, // banner图
  })

  //--------------------------------------->
  // Article.associate = () => {
  //   Article.belongsToMany(app.model.SystemUser, { through: app.model.ArticleUserLikes, foreignKey: 'article_id'})
  // }

  return Article  
}