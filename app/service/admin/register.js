const Service = require("egg/index").Service;

class RegisterService extends Service {
  async userRegister(options) {
    try {
      const userInfo = await this.ctx.model.SystemUser.findOne({
        where: {
          username: options.username
        }
      })
      if(userInfo) {
        this.ctx.helper.error(200, 10204, '用户名已存在!')
      } else {
        options.name = options.name.length === 0 ? options.username : options.name
        options.password = await this.ctx.helper.cryptoMd5(options.password, this.config.keys)
        const result = await this.ctx.model.SystemUser.create(options)
        if(result) {
          this.ctx.body = {
            code: 200,
            message: "注册成功!"
          };          
        } else {
          this.ctx.helper.error(200, 10204, '注册失败!')
        }        
      }
    }catch (err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')      
    }
  }
}

module.exports = RegisterService