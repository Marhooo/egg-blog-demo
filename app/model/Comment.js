const db = require("../database/db.js");

module.exports = (app) => {
  const { STRING, INTEGER, TEXT, UUID } = app.Sequelize;

  const Comment = db.defineModel(app, "comments", {
    content: { type: TEXT("long"), allowNull: false }, // 评论内容
    author_id: {
      type: STRING,
      allowNull: false,
    }, // 作者id  
    article_id: {
      type: UUID,
      allowNull: false  
    }, // 文章id
    commenter_id: {
      type: STRING,
      allowNull: false,
    }, // 评论者id    
    praise_num: {
      type: INTEGER,
      defaultValue: 0,
    }, //  点赞数
  });

  //--------------------------------------->
  Comment.associate = () => {
    Comment.belongsTo(app.model.Article);
  }

  return Comment;
};
