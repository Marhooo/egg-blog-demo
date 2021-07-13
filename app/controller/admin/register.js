const Controller = require('../../core/base_controller');

class RegisterController extends Controller {
  //用户注册
  async userRegister() {
    try {
      const Rule = {
        username: {
          type: 'userName',
          allowEmpty: false
        },
        password: { type: 'string', min: 6, max: 16, allowEmpty: false},
        mobile_phone: {type: 'userPhone', allowEmpty: false},
        name: {type: 'string', min: 4, max: 8, required: false}
        //required: false 表示可以为Null， allowEmpty: false 表示不允许为'空字符串'!
      };
      this.ctx.validate(Rule, this.ctx.request.body);
      const options = this.ctx.request.body
      await this.service.admin.register.userRegister(options)    
    } catch(err) {
      err.warn = '参数错误!'
      this.ctx.helper.error(200, 10030, err);   
    }
  }
}

module.exports = RegisterController;
