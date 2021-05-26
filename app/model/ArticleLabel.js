const db = require('../database/db');

module.exports = (app) => {
  const { UUID, STRING, INTEGER } = app.Sequelize;

  const ArticleLabel = db.defineModel(app, 'articlelabel', {
    label_name: { type: STRING, allowNull: false },
    add_num: { type: INTEGER, defaultValue: 0 },
    label_src: STRING,
    field_id: { type: UUID, allowNull: false },
  });

  return ArticleLabel;
};
