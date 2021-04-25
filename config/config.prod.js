// 数据库信息配置
//框架提供了变量 app.config.env 来表示应用当前的运行环境。
//prod 环境会加载 config.prod.js
exports.sequelize = {
    // 数据库类型
    dialect: "mysql",
    // host
    host: "localhost",
    // 端口号
    port: "3306",
    // 用户名
    username: "root",
    // 密码
    password: "fuwuqi123456",
    // 数据库名
    database: "egg_server"
};