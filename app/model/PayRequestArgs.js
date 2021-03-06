const db = require('../database/db');

module.exports = (app) => {
  const { UUID, STRING, INTEGER, TEXT } = app.Sequelize;

  const PayRequestArgs = db.defineModel(app, 'payrequest_vars', {
    package: STRING,
    pay_sign: TEXT('long'), //串会很长
    time_stamp: INTEGER,
    noncestr: STRING,
    signtype: { type: STRING, defaultValue: 'RSA' },
    pay_order: {
      type: UUID,
      references: {
        model: 'order_info',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    }, //隶属支付订单id
  });

  return PayRequestArgs;
};
