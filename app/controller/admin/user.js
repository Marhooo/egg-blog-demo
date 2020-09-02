const Controller = require("../../core/base_controller");
const { cryptoMd5 } = require("../../extend/helper");

class UserController extends Controller {
  //获取用户列表
  async userList() {
    const getListData = this.ctx.request.body;
    const list = await this.ctx.service.admin.user.userList(getListData);
    const roleList = await this.ctx.service.admin.role.getRoleList();
    for (let i = 0; i < list.rows.length; i++) {
      for (let j = 0; j < roleList.rows.length; j++) {
        if (list.rows[i].role_id === roleList.rows[j].id) {
          list.rows[i].dataValues.roleName = roleList.rows[j].name;
        }
      }
    }
    this.ctx.body = list
  }


  //修改用户信息
  async editUserInfo () {
    const userData = this.ctx.request.body

    const newData = {}
    for (const item in userData) {
      if (item !== "password") {
        newData[item] = userData[item]
      }
    }

    this.ctx.body = await this.service.admin.user.editUserInfo(newData)
  }




}

module.exports = UserController
