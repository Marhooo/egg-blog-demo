const db = require('../database/db');

module.exports = (app) => {
  const { UUID, STRING, INTEGER, BOOLEAN } = app.Sequelize;

  const Game = db.defineModel(app, 'game_monitor', {   
    imei: STRING, //设备IMEI码
    verify_code: INTEGER, //生成的激活码
    user_id: UUID, //购买人userid
    open_id: UUID, //购买人openid    
    has_besend: { type: BOOLEAN, defaultValue: false }, //是否已经发给客户  
    online: { type: BOOLEAN, defaultValue: false }, //是否在线
    can_load: { type: BOOLEAN, defaultValue: true }, //是否可用此激活码
    wechat_name: STRING, //购买人微信名
    pay_order: {
      //隶属支付订单id
      type: UUID,
      references: {
        model: 'order_info',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    aide_type: { type: STRING, defaultValue: '38元通用型' }, //辅助类型
    id: {
      type: INTEGER, // 字段类型
      primaryKey: true, // 是否为主键
      unique: true, // 是否唯一
      autoIncrement: true, // 是否为自增
    }  
  });

  return Game;
};
