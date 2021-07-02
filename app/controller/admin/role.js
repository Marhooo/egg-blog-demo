const Controller = require("../../core/base_controller")

class RoleController extends Controller{
  // 获取角色列表
  async getRoleList () {
    await this.ctx.service.admin.role.getRoleList()
  }

  // 增加修改角色
  async addRole () {
    const options = this.ctx.request.body
    await this.service.admin.role.addRole(options)
  }

  // 删除角色
  async delRole () {
    const options = this.ctx.request.body
    await this.ctx.service.admin.role.delRole(options)
  }

  // 分配角色权限
  async rolePermissions () {
    const options = this.ctx.request.body
    await this.ctx.service.admin.role.rolePermissions(options)
  }
  
  // 获取角色所拥有的权限
  async searchRolePermissions () {
    const options = this.ctx.request.body
    await this.ctx.service.admin.role.searchRolePermissions(options)
  }
}

module.exports = RoleController