const db = require("../database/db")

module.exports = app =>{
    const { UUID, STRING, INTEGER, BOOLEAN } = app.Sequelize

    const Order = db.defineModel(app, "order_info", {
        mchid: INTEGER,  //入账微信支付号
        appid: STRING,  //入账绑定主体应用:小程序appid、公众号appid？
        user_id: UUID,   //购买人userid
        payer_id: UUID,  //购买人openid
        trade_type: STRING,  //交易类型 JSAPI：公众号、小程序支付 NATIVE：扫码支付 APP：APP支付 MICROPAY：付款码支付 MWEB：H5支付 FACEPAY：刷脸支付
        prepay_id: STRING,  //预支付交易会话标识   如果客户第一次放弃支付可以在订单管理中重新呼起此单支付
        pay_status: { type: STRING, defaultValue: "1" }, //0:已取消, 1:待支付, 2:已支付
        product_description: STRING,
        pay_total: INTEGER,   //订单总价
        original_price: INTEGER, //订单原价
        discount_tag: STRING,  //订单优惠标记
        currency: { type: STRING, defaultValue: "CNY" }, //货币类型
        time_expire: INTEGER,  //订单过期的时间哈希戳，依据订单的创建时间+15分钟
        invoice_id: STRING, //商家小票
        payer_client_ip: STRING, //购买人ip地址
        store_info: STRING, //收款子商户门店或网店信息
        installment: { type: BOOLEAN, defaultValue: false }, //是否分期
        profit_sharing: { type: BOOLEAN, defaultValue: false } //是否利润分账
    })

    return Order
}