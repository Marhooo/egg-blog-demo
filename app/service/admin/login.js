const Service = require("egg/index").Service

class LoginService extends Service{
  async userLogin(options) {
    const Op = this.app.Sequelize.Op;
    try{
      const { loginuser, password } = options;
      const user = await this.ctx.model.SystemUser.findOne({
        where: {
          [Op.or]: [
            {username: loginuser},
            {mobile_phone: loginuser}
          ]
        }
      })
      if (!user || user.status === "2") {
        this.ctx.helper.error(200, 10204, '账号不存在!');
      } else {
        const verifyPass = await this.ctx.helper.cryptoMd5(password, this.config.keys);
        const roleResult = await this.ctx.model.SystemRole.findByPk(user.role_id)
        if (user.password !== verifyPass) {
          this.ctx.helper.error(200, 10204, '密码错误!');
        } else if (user.status === "0") {
          this.ctx.helper.error(200, 10020, '该账号已被禁用,请联系管理员!');
        } else if (!roleResult.status) {
          this.ctx.helper.error(200, 10020, '该账号所在角色已被禁用,请联系管理员!');
        } else {
          const refresh_token = await this.ctx.helper.createToken(
            { id: user.id },
            "7",
            "days"
          );
          const access_token = await this.ctx.helper.createToken(
            { id: user.id },
            "2",
            "hours"
          );
          const uid = user.id;
          await this.ctx.service.admin.login.saveToken({
            uid,
            access_token,
            refresh_token,
          });
          this.ctx.body = {
            code: 200,
            data: {
              access_token,
            },
          }
        }
      }      
    }catch(err){
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')
    }
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
  async getUserInfo (options) {
    try {
      if(options.verify === true) {
        const userInfo = await this.ctx.model.SystemUser.findOne({
          where: {
            id: options.message.id
          }
        })
        const roleInfo = await this.ctx.model.SystemRole.findByPk(userInfo.role_id)
        const permissionInfo = await this.ctx.model.SystemRolePermission.findOne({
          where: {
            role_id: userInfo.role_id
          }
        })
        userInfo.dataValues.roleName = roleInfo.name
        userInfo.dataValues.authorityRouter = permissionInfo.permission_page
        userInfo.dataValues.permissionButton = permissionInfo.permission_button
        this.ctx.session.user = userInfo
        this.ctx.body = {
          code: 200,
          data: {
            name: userInfo.name,
            role: userInfo.getDataValue("roleName"),
            authorityRouter: userInfo.getDataValue("authorityRouter") || "",
            permissionButton: userInfo.getDataValue("permissionButton") || "",
            avatar: userInfo.avatar,
            id: userInfo.id,        
          }
        }
      } else {
        this.ctx.helper.error(401, 10000, "token过期或账号不存在!")
      }
    }catch(err){
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')      
    }
  }  


  // 查询用户信息
  async getUserInfoId (options) {
    try {
      const result = await this.ctx.model.SystemUser.findByPk(options.id)
      if(result) {
        this.ctx.body = {
          code: 200,
          data: result
        }
      } else {
        this.ctx.helper.error(200, 10204, '查询失败!')
      }
    }catch(err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '未知错误!')        
    }
  }
}

module.exports = LoginService