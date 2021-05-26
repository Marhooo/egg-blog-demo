const db = require('../database/db');

module.exports = (app) => {
  const { STRING, BOOLEAN } = app.Sequelize;

  const AcademicField = db.defineModel(app, 'academicfield', {
    academic_name: { type: STRING, allowNull: false },
    describe: STRING,
    status: { type: BOOLEAN, defaultValue: true },
  });

  return AcademicField;
};
