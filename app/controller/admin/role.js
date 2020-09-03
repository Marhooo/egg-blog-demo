const Controller = require("../../core/base_controller")

class RoleController extends Controller{
  // 获取角色列表
  async getRoleList () {
    this.ctx.body = await this.ctx.service.admin.role.getRoleList()
  }

  // 增加修改角色
  async addRole () {
    const roleData = this.ctx.request.body
    this.ctx.body = await this.service.admin.role.addRole(roleData)
  }

  // 删除角色
  async delRole () {
    const id = this.ctx.request.body.id
    this.ctx.body = await this.ctx.service.admin.role.delRole(id)
  }
  

}

module.exports = RoleController