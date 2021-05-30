const Controller = require('../../core/base_controller');

class PayMentController extends Controller {
  //生成支付订单接口
  async addPayOrder() {
    const payOrderData = this.ctx.request.body;
    await this.ctx.service.customer.payment.addPayOrder(payOrderData);
  }

  // 小程序支付统一下单接口
  async payWechatMini() {
    const payData = this.ctx.request.body;
    await this.ctx.service.customer.payment.getPayWechatMini(payData);
  }

  //查询微信小程序订单状态
  async inquirePayWechatMini() {
    const inquireData = this.ctx.request.query;
    await this.ctx.service.customer.payment.inquirePayWechatMini(inquireData);
  }

  //查询微信小程序支付订单列表
  async inquirePayList() {
    const inquireData = this.ctx.request.body;
    await this.ctx.service.customer.payment.inquirePayList(inquireData);
  }
}

module.exports = PayMentController;
