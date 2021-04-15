const Service = require('egg/index').Service;

class WxLoginService extends Service {
  //Openid获取微服务
  async getOpenid(url) {
    const res = await this.ctx.curl(url, {
      dataType: 'json',
    });
    //console.log(res)
    if (res.data.openid) {
      return {
        openid: res.data.openid,
        code: 1,
        sessionKey: res.data.session_key,
      };
    }
    return {
      // 忽略网络请求失败
      msg: res.data.errmsg,
      code: 0,
    };
  }

  async findOpenId(openid) {
    const user = await this.ctx.model.SystemUser.findOne({
      where: { openid },
    });
    return user;
  }

  // 生成 token 保存数据库
  async saveToken(data) {
    await this.app.model.SystemToken.upsert(data);
  }
}

module.exports = WxLoginService;
