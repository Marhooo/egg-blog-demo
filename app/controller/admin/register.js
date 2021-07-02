const Controller = require('../../core/base_controller');

class RegisterController extends Controller {
  //用户注册
  async userRegister() {
    const options = this.ctx.request.body
    await this.service.admin.register.userRegister(options)
  }
}

module.exports = RegisterController;
