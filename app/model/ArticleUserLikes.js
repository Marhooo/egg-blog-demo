const db = require('../database/db');

module.exports = (app) => {
  const { UUID, INTEGER } = app.Sequelize;

  const ArticleUserLikes = db.defineModel(app, 'articleuserlikes', {
    id: {
      type: INTEGER, // 字段类型
      primaryKey: true, // 是否为主键
      unique: true, // 是否唯一
      autoIncrement: true, // 是否为自增
    },
    user_id: {
      type: UUID,
      allowNull: false
    },
    article_id: {
      type: UUID,
      allowNull: false
    },
  });

  return ArticleUserLikes;
};
