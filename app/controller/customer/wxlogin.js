const Controller = require('../../core/base_controller');

class WxLoginController extends Controller {
  //微信小程序接口获取openid
  async openid() {
    const { js_code } = this.ctx.request.body;
    const wx = {
      appId: 'wxabd15cdb355480a5',
      appSecret: '95ecc98b57fd8551e24fc3056156b0e4',
    };
    const url =
      'https://api.weixin.qq.com/sns/jscode2session?appid=' +
      wx.appId +
      '&secret=' +
      wx.appSecret +
      '&js_code=' +
      js_code +
      '&grant_type=authorization_code';
    const detail = await this.ctx.service.customer.wxlogin.getOpenid(url);
    this.ctx.body = detail;
  }

  //微信用户拿着openid登录(如果没有注册，就新建账户并返回token)换取token
  async wxLogin() {
    const { openid } = this.ctx.request.body;
    let results;
    const roleinfo = await this.ctx.model.SystemRole.findOne({
      where: { name: '游客' },
    });
    const user = await this.ctx.service.customer.wxlogin.findOpenId(openid);
    if (!user) {
      await this.ctx.service.customer.wxregister.WxRegister({
        username: 'test',
        password: 'test',
        openid: openid,
        role_id: roleinfo.id,
      });
      const user2 = await this.ctx.service.customer.wxlogin.findOpenId(openid);
      if (user2) {
        const refresh_token = await this.ctx.helper.createToken({ id: user2.id }, '7', 'days');
        const access_token = await this.ctx.helper.createToken({ id: user2.id }, '2', 'hours');
        const uid = user2.id;
        await this.ctx.service.customer.wxlogin.saveToken({
          uid,
          access_token,
          refresh_token,
        });
        results = {
          code: 200,
          data: { access_token },
        };
      } else {
        results = {
          code: 10101,
          message: '微信首次登录注册表失败',
        };
      }
    } else {
      const role = await this.ctx.model.SystemRole.findById(user.role_id);
      if (!role.status) {
        results = {
          code: 10000,
          message: '该账号所在角色已被禁用,请联系管理员',
        };
      } else if (!user.status) {
        results = {
          code: 10000,
          message: '该账号已被禁用,请联系管理员',
        };
      } else {
        const refresh_token = await this.ctx.helper.createToken({ id: user.id }, '7', 'days');
        const access_token = await this.ctx.helper.createToken({ id: user.id }, '2', 'hours');
        const uid = user.id;
        await this.ctx.service.customer.wxlogin.saveToken({
          uid,
          access_token,
          refresh_token,
        });
        results = {
          code: 200,
          data: { access_token },
        };
      }
    }
    this.ctx.body = results;
  }
}

module.exports = WxLoginController;
