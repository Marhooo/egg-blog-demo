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
      const paySign_message =
        appid + '\n' + timep + '\n' + nonceStr + '\n' + `prepay_id=${res.data.prepay_id}` + '\n';
      const paySign = this.ctx.helper.wechatPayCrypto(paySign_message);
      console.log(res);
      if (res.data.prepay_id) {
        await this.ctx.model.Order.upsert({
          id: id,
          prepay_id: res.data.prepay_id,
        });
        if (res.status == 200) {
          await this.ctx.model.PayRequestArgs.create({
            package: `prepay_id=${res.data.prepay_id}`,
            pay_order: id,
            timeStamp: timep,
            nonceStr: nonceStr,
            signType: 'RSA',
            paySign: paySign,
          });
          this.ctx.body = {
            code: 200,
            data: {
              package: `prepay_id=${res.data.prepay_id}`,
              id: id,
              timeStamp: timep,
              nonceStr: nonceStr,
              signType: 'RSA',
              paySign: paySign,
            },
          };
        } else {
          this.ctx.body = {
            code: 10404,
            message: '预支付交易标识官方接口出错',
          };
        }
      } else {
        this.ctx.body = {
          code: 10404,
          message: '预支付交易标识官方接口出错',
        };
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '预支付交易标识获取失败');
    }
  }

  //查询微信小程序订单状态
  async inquirePayWechatMini(options) {
    try {
      const { mchid, out_trade_no } = options;
      const url = `https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${out_trade_no}?mchid=${mchid}`;
      const method = 'GET';
      const canonicalUrl = `/v3/pay/transactions/out-trade-no/${out_trade_no}?mchid=${mchid}`;
      const timep = Math.round(new Date().getTime() / 1000);
      const nonceStr = `${Date.now()}`;
      const message = method + '\n' + canonicalUrl + '\n' + timep + '\n' + nonceStr + '\n' + '\n';
      const cryptoRsa = this.ctx.helper.wechatPayCrypto(message);
      const res = await this.ctx.curl(url, {
        dataType: 'json',
        method: 'GET',
        timeout: 6000,
        headers: {
          'content-type': 'application/json',
          Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",nonce_str="${nonceStr}",signature="${cryptoRsa}",timestamp="${timep}",serial_no="1A2CEAD5617A2E017132CCA4AAAC10C1FA265703"`,
        },
      });
      console.log(res);
      if (res.status === 200) {
        this.ctx.body = {
          code: 200,
          data: res.data,
        };
      } else {
        this.ctx.body = {
          code: 10404,
          message: '查询微信订单官方接口出错',
        };
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '查询微信订单失败');
    }
  }
  //查询微信小程序支付订单列表，且未支付状态下的订单的支付调用参数
  async inquirePayList(options) {
    try {
      const { payer_id, pageSize, currentPage } = options;
      const result = await this.ctx.model.Order.findAndCountAll({
        limit: parseInt(pageSize),
        offset: parseInt(pageSize) * (parseInt(currentPage) - 1),
        where: {
          payer_id: payer_id,
        },
      });
      for (let i = 0; i < result.rows.length; i++) {
        //这一步根据支付订单号查询状态为未支付的支付调用参数
        if (result.rows[i].pay_status === '1') {
          const payArgs = await this.ctx.model.PayRequestArgs.findOne({
            where: {
              pay_order: result.rows[i].id,
            },
          });
          result.rows[i].dataValues.payArgs = payArgs;
        }
        //这一步查询到支付订单的所有订单商品详情
        const order_detail = await this.ctx.model.OrderDetail.findAll({
          where: {
            pay_order: result.rows[i].id,
          },
        });
        result.rows[i].dataValues.order_detail = order_detail;
      }
      this.ctx.body = {
        code: 200,
        data: result,
      };
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '查询订单列表失败');
    }
  }
}

module.exports = PayMentService;
