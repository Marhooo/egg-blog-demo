const db = require("../database/db.js");

module.exports = (app) => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const Comment = db.defineModel(app, "comments", {
    content: { type: TEXT("long"), allowNull: false }, // 评论内容
    author_id: {
      type: STRING,
      allowNull: false,
    }, // 作者id
    article_id: {
      type: STRING,
      allowNull: false,
    }, // 文章id
    praise_num: {
      type: INTEGER,
      defaultValue: 0,
    }, //  点赞数
  });

  return Comment;
};
