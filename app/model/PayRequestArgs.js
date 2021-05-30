const db = require("../database/db")

module.exports = app =>{
    const { UUID, STRING, INTEGER, TEXT } = app.Sequelize

    const PayRequestArgs = db.defineModel(app, "payrequest_vars", {
        package: STRING,
        paySign: TEXT("long"), //串会很长
        timeStamp: INTEGER,
        nonceStr: STRING,
        signType: { type: STRING, defaultValue: "RSA" },       
        pay_order: UUID //隶属支付订单id
    })

    return PayRequestArgs
}