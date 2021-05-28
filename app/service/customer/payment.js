const Service = require('egg').Service;

class PayMentService extends Service {
  //生成支付订单
  async addPayOrder(options) {
    try {
      options.payer_id = this.ctx.session.user.openid;
      options.time_expire = Math.round(new Date().getTime() / 1000) + 15 * 60;
      //const {appid, mchid, product_description, pay_total, original_price, payer_client_ip} = options
      const result = await this.ctx.model.Order.create(options);
      this.ctx.body = result;
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '支付订单创建失败');
    }
  }
  //统一微信小程序下单拿prepay_id
  async getPayWechatMini(options) {
    try {
      const { appid, mchid, product_description, pay_total, currency, payer_id, id } = options;
      const params = {
        mchid: mchid,
        out_trade_no: id,
        appid: appid,
        description: product_description,
        notify_url: 'https://weixin.qq.com/',
        amount: {
          total: pay_total,
          currency: currency,
        },
        payer: {
          openid: payer_id,
        },
      };
      const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi';
      const method = 'POST';
      const canonicalUrl = '/v3/pay/transactions/jsapi';
      const timep = Math.round(new Date().getTime() / 1000);
      const nonceStr = `${Date.now()}`;
      const data = JSON.stringify(params);
      const message =
        method + '\n' + canonicalUrl + '\n' + timep + '\n' + nonceStr + '\n' + data + '\n';
      const cryptoRsa = this.ctx.helper.wechatPayCrypto(message);
      const res = await this.ctx.curl(url, {
        dataType: 'json',
        method: 'POST',
        data: params,
        timeout: 6000,
        headers: {
          'content-type': 'application/json',
          Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",nonce_str="${nonceStr}",signature="${cryptoRsa}",timestamp="${timep}",serial_no="1A2CEAD5617A2E017132CCA4AAAC10C1FA265703"`,
        },
      });
      //console.log(res)
      if (res.status == 200) {
        this.ctx.body = {
          code: 200,
          data: res.data,
        };
      } else {
        this.ctx.body = {
          code: 10404,
          message: '预支付交易标识接口出错',
        };
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '预支付交易标识获取失败');
    }
  }
}

module.exports = PayMentService;
