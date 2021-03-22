const Service = require("egg/index").Service;

class WxRegisterService extends Service {
  async WxRegister(options) {
    await this.ctx.model.SystemUser.create(options)  
  }
}

module.exports = WxRegisterService