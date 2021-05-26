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
    await this.ctx.service.customer.payment.getPayWechatMini(payData)
  }

  //
}

module.exports = PayMentController;
