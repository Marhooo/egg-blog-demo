// 数据库信息配置
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
    password: "cgz123456",
    // 数据库名
    database: "egg_server",
    //东八时区
    timezone: '+08:00',
    //连接池设置
    pool: {   
        max: 3, //最大连接数
        min: 0, //最小连接数
        idle: 10000
    },    
};