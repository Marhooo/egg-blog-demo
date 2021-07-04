const Service = require("egg").Service;

class RoleService extends Service {
  //获取角色列表
  async getRoleList() {
    try{
      const result = await this.ctx.model.SystemRole.findAndCountAll()
      for (let i = 0; i < result.rows.length; i++) {
        if(result.rows[i].name === "超级管理员") {
          result.rows[i].dataValues.disabled = true;
        }
      }
      this.ctx.body = {
        code: 200,
        data: result
      }
    } catch(err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')       
    }
  }


  // 增加修改角色
  async addRole(options) {
    try {
      console.log(options)
      const { id = null, name, describe, status } = options;
      if(id) {
        const roleInfo = await this.ctx.model.SystemRole.findByPk(id)
        if(roleInfo.name === '超级管理员') {
          this.ctx.helper.error(200, 10020, '系统最高权限不可以修改!');
        } else {
          const result = await this.ctx.model.SystemRole.update({
            name,
            describe,
            status,            
          },{
            where: {
              id
            }
          })
          if(result > 0) {
            this.ctx.body = {
              code: 200,
              message: "角色修改成功!"
            }
          }
        }
      } else {
        const roleInfo = await this.ctx.model.SystemRole.findOne({
          where: {
            name
          }
        })
        if(!roleInfo) {
          const transaction = await this.ctx.model.transaction();
          const roleBd = await this.ctx.model.SystemRole.create({
            name,
            describe,
            status,            
          }, {transaction})
          const permissionBd = await this.ctx.model.SystemRolePermission.create({
            role_id: roleBd.id
          }, {transaction})
          if(roleBd && permissionBd) {
            await transaction.commit()
            this.ctx.body = {
              code: 200,
              message: "角色添加成功!",
            };            
          } else {
            await transaction.rollback()
            this.ctx.helper.error(200, 10204, '角色添加失败!');
          }
        } else {
          this.ctx.helper.error(200, 10204, '角色已存在!');
        }
      }
    } catch (err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')      
    }
  }


  // 删除角色
  async delRole (options) {
    try {
      const roleInfo = await this.ctx.model.SystemRole.findByPk(options.id)
      if(roleInfo.name === '超级管理员') {
        this.ctx.helper.error(200, 10020, '系统最高权限不可以删除!');
      } else {
        const transaction = await this.ctx.model.transaction();
        const roleDy = await this.ctx.model.SystemRole.destroy({
          where: {
            id: options.id
          },
          transaction
        })
        const permissionDy = await this.ctx.model.SystemRolePermission.destroy({
          where: {
            role_id: options.id
          },
          transaction
        })
        if(roleDy > 0 && permissionDy > 0) {
          await transaction.commit()
          this.ctx.body = {
            code: 200,
            message: "角色删除成功!",
          }
        } else {
          await transaction.rollback()
          this.ctx.helper.error(200, 10204, '角色删除失败!');
        }
      }
    } catch(err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')      
    }
  }


  // 分配角色权限
  async rolePermissions (options) {
    try {
      const { id, selectPermission } = options
      let permissionPage = []
      let permissionButton = []
      for (let i = 0; i < selectPermission.length; i++) {
        if (selectPermission[i].toString().includes("btn")) {
          permissionButton.push(selectPermission[i])
        } else {
          permissionPage.push(selectPermission[i])
        }
      }
      const result = await this.ctx.model.SystemRolePermission.update({
        permission_page: permissionPage.join(","),
        permission_button: permissionButton.join(","),        
      }, {
        where: {
          role_id: id          
        }
      })
      //console.log(result)
      if(result > 0) {
        this.ctx.body = {
          code: 200,
          message: "该角色权限分配成功!",
        }        
      } else {
        this.ctx.helper.error(200, 10204, '该角色权限分配失败!');
      }   
    } catch(err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')      
    }
  }


  // 获取角色所拥有的权限
  async searchRolePermissions (options) {
    try {
      const result = await this.ctx.model.SystemRolePermission.findOne({
        where: {
          role_id: options.id
        }
      })
      if(result) {
        this.ctx.body = {
          code: 200,
          data: {
            permissionPage: result.permission_page,
            permissionButton: result.permission_button,
          }
        }
      } else {
        this.ctx.helper.error(200, 10204, '查询失败!');
      }
    } catch(err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')        
    }
  }

}

module.exports = RoleService;
