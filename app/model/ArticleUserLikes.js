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
      references: {
        model: 'system_users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',      
    },
    article_id: {
      type: UUID,
      references: {
        model: 'articles',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  return ArticleUserLikes;
};
