const Service = require('egg').Service;

class PayMentService extends Service {
  //生成支付订单
  async addPayOrder(options) {
    try {
      options.user_id = this.ctx.session.user.id
      options.payer_id = this.ctx.session.user.openid;
      options.appid = this.app.config.wechat.appid
      options.mchid = this.app.config.wechat.mchid
      options.time_expire = Math.round(new Date().getTime() / 1000) + 15 * 60;
      //const { product_description, pay_total, original_price, payer_client_ip} = options
      const result = await this.ctx.model.Order.create(options);
      this.ctx.body = {
        code: 200,
        data: {
          currency: result.currency,
          order_id: result.id,
          product_description: result.product_description,
          pay_total: result.pay_total          
        }
      };
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '支付订单创建失败');
    }
  }
  //统一微信小程序下单拿prepay_id 且关闭已超时订单
  async getPayWechatMini(options) {
    const transaction = await this.ctx.model.transaction()
    try {
      const { product_description, pay_total, currency, order_id } = options;
      //下单前先查询当前用户在数据库中的订单状态为未支付，且已过时的订单，进行关单操作
      const shouldBeClosed = await this.ctx.model.Order.findAll({
        where: {
          pay_status: '1',
          payer_id: this.ctx.session.user.openid,
        },
      });
      for (let i = 0; i < shouldBeClosed.length; i++) {
        if (shouldBeClosed[i].time_expire <= Math.round(new Date().getTime() / 1000)) {
          const params = {
            mchid: `${this.app.config.wechat.mchid}`,
          };
          const url = `https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${shouldBeClosed[i].id}/close`;
          const method = 'POST';
          const canonicalUrl = `/v3/pay/transactions/out-trade-no/${shouldBeClosed[i].id}/close`;
          const timep = Math.round(new Date().getTime() / 1000);
          const nonceStr = `${Date.now()}`;
          const data = JSON.stringify(params);
          const message =
            method + '\n' + canonicalUrl + '\n' + timep + '\n' + nonceStr + '\n' + data + '\n';
          const cryptoRsa = this.ctx.helper.wechatPaySignCrypto(message);
          const closed = await this.ctx.curl(url, {
            dataType: 'json',
            method: 'POST',
            data: params,
            timeout: 6000,
            headers: {
              'content-type': 'application/json',
              Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${this.app.config.wechat.mchid}",nonce_str="${nonceStr}",signature="${cryptoRsa}",timestamp="${timep}",serial_no="${this.app.config.wechat.serial_no}"`,
            },
          });
          if(closed.status == 204 || closed.status == 400 || closed.status == 404 || closed.status == 403) {
            await this.ctx.model.Order.upsert({
              pay_status: '0',
              id: shouldBeClosed[i].id,
            });
          }
        }
      }
      //以下是拿prepay_id过程
      const params = {
        mchid: `${this.app.config.wechat.mchid}`,
        out_trade_no: order_id,
        appid: this.app.config.wechat.appid,
        description: product_description,
        notify_url: 'https://weixin.qq.com/',
        amount: {
          total: pay_total,
          currency: currency,
        },
        payer: {
          openid: this.ctx.session.user.openid,
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
      const cryptoRsa = this.ctx.helper.wechatPaySignCrypto(message);
      const res = await this.ctx.curl(url, {
        dataType: 'json',
        method: 'POST',
        data: params,
        timeout: 6000,
        headers: {
          'content-type': 'application/json',
          Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${this.app.config.wechat.mchid}",nonce_str="${nonceStr}",signature="${cryptoRsa}",timestamp="${timep}",serial_no="${this.app.config.wechat.serial_no}"`,
        },
      });
      const paySign_message =
      this.app.config.wechat.appid + '\n' + timep + '\n' + nonceStr + '\n' + `prepay_id=${res.data.prepay_id}` + '\n';
      const paySign = this.ctx.helper.wechatPaySignCrypto(paySign_message);
      console.log(res);
      if (res.status == 200 && res.data.prepay_id) {
        await this.ctx.model.Order.upsert({
          id: order_id,
          prepay_id: res.data.prepay_id,
        }, transaction);
        await this.ctx.model.PayRequestArgs.create({
          package: `prepay_id=${res.data.prepay_id}`,
          pay_order: order_id,
          time_stamp: timep,
          noncestr: nonceStr,
          signtype: 'RSA',
          pay_sign: paySign,
        }, transaction);
        await transaction.commit();
        this.ctx.body = {
          code: 200,
          data: {
            package: `prepay_id=${res.data.prepay_id}`,
            time_stamp: `${timep}`,
            order_id: order_id,
            noncestr: nonceStr,
            signtype: 'RSA',
            pay_sign: paySign,
          },
        };
      } else if (res.status == 400) {
        await transaction.rollback()
        this.ctx.body = {
          code: 10030,
          message: res.data.message,
        };          
      } else {
        await transaction.rollback()
        this.ctx.body = {
          code: 10404,
          message: '预支付交易标识官方接口出错',
        };
      }
    } catch (err) {
      await transaction.rollback()
      console.log(err);
      this.ctx.helper.error(200, 10404, '预支付交易标识获取失败');
    }
  }

  //查询微信小程序订单状态(并且如果订单支付成功，修改支付状态到数据库)
  async inquirePayWechatMini(options) {
    try {
      const { out_trade_no } = options;
      const url = `https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${out_trade_no}?mchid=${this.app.config.wechat.mchid}`;
      const method = 'GET';
      const canonicalUrl = `/v3/pay/transactions/out-trade-no/${out_trade_no}?mchid=${this.app.config.wechat.mchid}`;
      const timep = Math.round(new Date().getTime() / 1000);
      const nonceStr = `${Date.now()}`;
      const message = method + '\n' + canonicalUrl + '\n' + timep + '\n' + nonceStr + '\n' + '\n';
      const cryptoRsa = this.ctx.helper.wechatPaySignCrypto(message);
      const res = await this.ctx.curl(url, {
        dataType: 'json',
        method: 'GET',
        timeout: 6000,
        headers: {
          'content-type': 'application/json',
          Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${this.app.config.wechat.mchid}",nonce_str="${nonceStr}",signature="${cryptoRsa}",timestamp="${timep}",serial_no="${this.app.config.wechat.serial_no}"`,
        },
      });
      if (res.status === 200) {
        if(res.data.trade_state === 'SUCCESS') {
          await this.ctx.model.Order.upsert({
            pay_status: '2',
            id: out_trade_no,
          });
          this.ctx.body = {
            code: 200,
            message: '支付成功!',
          };          
        }
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

  //查询微信小程序支付订单列表，并对未支付状态下的订单添加支付调用参数，已支付订单无需返回支付调用参数
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
