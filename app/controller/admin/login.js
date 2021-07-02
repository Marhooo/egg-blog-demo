const Controller = require("../../core/base_controller");

class LoginController extends Controller {
  //用户登陆
  async userLogin() {
    const options = this.ctx.request.body;
    await this.ctx.service.admin.login.userLogin(options)
  }


  // 登录查询个人信息
  async getUserInfo () {
    const token = this.ctx.helper.getAccessToken()
    let options = {}
    this.ctx.app.jwt.verify(token, this.ctx.app.config.jwt.secret, function (err, decoded) {
      if (err) {
        options.verify = false
        options.message = err.message
      } else {
        options.verify = true
        options.message = decoded
      }
    })
    await this.ctx.service.admin.login.getUserInfo(options)
  }


  // 获取用户信息
  async getUserInfoId () {
    const options = this.ctx.request.body
    await this.ctx.service.admin.login.getUserInfoId(options)
  }

  //用户登出
  async userLogout () {
    this.ctx.session.user = null
    this.ctx.body = {
      code: 200,
      message: "登出成功!"
    }
  }

}

module.exports = LoginController