const Service = require("egg/index").Service

class UserService extends Service{
  async findUsername (username) {
      const user = await this.ctx.model.SystemUser.findOne({
        where: { username },
      })
      return user
  }
  // 生成 token 保存数据库
  async saveToken (data) {
    await this.app.model.SystemToken.upsert(data)
  }

  // 查找 token 信息
  async findToken (access_token) {
    const tokenInfo = await this.ctx.model.SystemToken.findOne({
      where: {
        access_token,
      },
    })
    return tokenInfo
  }

  // 登录查询个人信息
  async getUserInfo (info) {
    const { ctx } = this
    let userInfo = ""
    await this.ctx.model.SystemUser.findOne({
      where: { id: info.message.id },
    }).then(async res => {
      console.log(res)
      if (res) {
        const roleInfo = await ctx.model.SystemRole.findById(res.role_id)
        res.setDataValue("roleName", roleInfo.name)
        await ctx.model.SystemRolePermission.findOne({
          where: { role_id: res.role_id },
        }).then(async perRes => {
          if (perRes) {
            res.setDataValue("authorityRouter", perRes.permission_page)
            res.setDataValue("permissionButton", perRes.permission_button)
          }

        })

      }
      userInfo = res
    })
    return userInfo
  }  


  // 查询用户信息
  async getUserInfoId (uid) {
    return await this.app.model.SystemUser.findById(uid)
  }


  
}

module.exports = UserService