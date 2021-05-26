const db = require("../database/db")

module.exports = app =>{
    const { UUID, STRING, INTEGER, TEXT } = app.Sequelize

    const OrderDetail = db.defineModel(app, "order_detail_info", {
        merchant_goods_id: TEXT("long"), //单个商品条形码数字,如果多个数量对应多个条形码逗号分开
        goods_name: STRING, //单个商品名称
        goods_id: UUID, //此单个商品的数据库uuid
        goods_num: INTEGER, //单品数量
        unit_price: INTEGER, //单个商品价格
        pay_order: UUID, //隶属支付订单id
    })

    return OrderDetail
}