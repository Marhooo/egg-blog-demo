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
  
}

module.exports = UserService