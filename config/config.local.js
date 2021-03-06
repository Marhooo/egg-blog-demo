// 数据库信息配置
exports.sequelize = {
  // 数据库类型
  dialect: 'mysql',
  // host
  host: 'localhost',
  // 端口号
  port: '3306',
  // 用户名
  username: 'root',
  // 密码
  password: 'cgz123456',
  // 数据库名
  database: 'egg_server',
  //东八时区
  timezone: '+08:00',
  //更改返回的时间UTC格式
  dialectOptions: {
    dateStrings: true,
    typeCast(field, next) {
      if (field.type === 'DATETIME') {
        return field.string();
      }
      return next();
    },
  },
};
