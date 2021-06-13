const Controller = require('../../core/base_controller');

class WxLoginController extends Controller {
  //微信侧接口获取openid(但此步未做校验，暂时不需要)，并进行数据库存入和token返回
  //无论是第一次微信注册登录还是微信登录都是这个接口换取token
  async wxRegisterLogin() {
    const requestData = this.ctx.request.body
    await this.ctx.service.customer.wxlogin.wxRegisterLogin(requestData)
  }

  //测试用的微信登录接口换取token
  async wxLogin() {
    const requestData = this.ctx.request.body
    await this.ctx.service.customer.wxlogin.wxLogin(requestData)
  }
}

module.exports = WxLoginController;
