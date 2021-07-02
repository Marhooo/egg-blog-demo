const Service = require("egg").Service;

class UserService extends Service{
  // 获取用户列表
  async userList (options) {
    try {
      const { currentPage, pageSize } = options
      const roleList = await this.ctx.model.SystemRole.findAndCountAll()
      const userList = await this.ctx.model.SystemUser.findAndCountAll({
        limit: parseInt(pageSize),
        offset: parseInt(pageSize) * (parseInt(currentPage) - 1)
      })
      for (let i = 0; i < userList.rows.length; i++) {
        for (let j = 0; j < roleList.rows.length; j++) {
          if (userList.rows[i].role_id === roleList.rows[j].id) {
            userList.rows[i].dataValues.roleName = roleList.rows[j].name;
          }          
        }
      }
      this.ctx.body = {
        code: 200,
        data: userList
      }
    } catch (err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')      
    }
  }

  //修改用户信息
  async editUserInfo(options){
    try {
      let newData = {}
      for (const item in options) {
        if (item !== "password") {
          newData[item] = options[item]
        }
      }
      newData.status = newData.status ? "1" : "0"
      const result = await this.ctx.model.SystemUser.update(newData, {
        where: {
          id: newData.id
        }
      })
      if(result > 0) {
        this.ctx.body = {
          code: 200,
          message: "用户信息修改成功!",
        }
      } else {
        this.ctx.helper.error(200, 10204, '用户信息修改失败!')
      }    
    } catch(err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')      
    }
  }


  //修改密码
  async editPassword(options){
    try {
      const myPassword = this.ctx.session.user.password
      const myId = this.ctx.session.user.id
      const oldPassVerify = await this.ctx.helper.cryptoMd5(options.oldPassword, this.config.keys)
      if(oldPassVerify !== myPassword) {
        this.ctx.helper.error(200, 10204, '原密码错误!')
      } else {
        const newPassVerify = await this.ctx.helper.cryptoMd5(options.newPassword, this.config.keys)
        const result = await this.ctx.model.SystemUser.update({
          password: newPassVerify
        }, {
          where: {
            id: myId
          }
        })
        if(result > 0) {
          this.ctx.body = {
            code: 200,
            message: "密码修改成功,请重新登陆!"
          }         
        } else {
          this.ctx.helper.error(200, 10204, '密码修改失败!')
        }
      }      
    } catch(err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')      
    }

  }


  // 删除用户
  async delUser (options) {
    try {
      const userInfo = await this.ctx.model.SystemUser.findByPk(options.id)
      const roleInfo = await this.ctx.model.SystemRole.findByPk(userInfo.role_id)
      if(userInfo && roleInfo) {
        if(roleInfo.name === '超级管理员') {
          this.ctx.helper.error(200, 10020, '系统最高管理员不可以删除!')
        } else {
          const result = await this.ctx.model.SystemUser.destroy({
            where: {
              id: options.id
            }
          })
          if(result > 0) {
            this.ctx.body = {
              code: 200,
              message: '用户删除成功!'
            }
          } else {
            this.ctx.helper.error(200, 10204, '用户删除失败!')
          }
        }
      } else {
        this.ctx.helper.error(200, 10204, '查询失败!')
      }     
    } catch (err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')      
    }
  }

}

module.exports = UserService