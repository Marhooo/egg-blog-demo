const db = require("../database/db");

module.exports = (app) => {
  const { STRING, TEXT } = app.Sequelize;

  const Reply = db.defineModel(app, "replys", {
    content: { type: TEXT("long"), allowNull: false }, // 评论内容
    from_user_id: {
      type: STRING,
      allowNull: false,
    }, // 当前评论人id
    comment_id: {
      type: STRING,
      allowNull: false,
    }, // 评论文章id
    to_user_id: {
      type: STRING,
      allowNull: false,
    }, // 评论对象id
    to_reply_user_id: {
      type: STRING     
    } // 回复对象id（抖音评论中对某个回复进行回复，可以为空）
  });

  return Reply;
};
