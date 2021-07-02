const Controller = require("../../core/base_controller");
const { cryptoMd5 } = require("../../extend/helper");

class UserController extends Controller {
  //获取用户列表
  async userList() {
    const options = this.ctx.request.query
    await this.ctx.service.admin.user.userList(options)
  }


  //修改用户信息
  async editUserInfo () {
    const options = this.ctx.request.body
    await this.service.admin.user.editUserInfo(options)
  }


  //修改密码
  async editPassword(){
    const options = this.ctx.request.body
    await this.ctx.service.admin.user.editPassword(options)
  }


  // 删除用户
  async delUser () {
    const options = this.ctx.request.body
    await this.ctx.service.admin.user.delUser(options)
  }

}

module.exports = UserController
