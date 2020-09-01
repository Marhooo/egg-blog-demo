const Controller = require("../../core/base_controller");
const { cryptoMd5 } = require("../../extend/helper");

class LoginController extends Controller {
  async userLogin() {
    const { username, password } = this.ctx.request.body;
    const keys = this.config.keys;
    let results = "";
    let roleStatus;
    const user = await this.ctx.service.admin.login.findUsername(username);
    if (!user || user.status === "2") {
      results = {
        code: 10000,
        message: "用户名不存在",
      };
    } else {
      const newPass = await cryptoMd5(password, keys);
      await this.ctx.model.SystemRole.findById(user.role_id).then(
        async (res) => {
          roleStatus = res.status;
        }
      );
      if (user.password !== newPass) {
        results = {
          code: 10000,
          message: "密码错误",
        };
      } else if (user.status === "0") {
        results = {
          code: 10000,
          message: "该账号已被禁用,请联系管理员",
        };
      } else if (!roleStatus) {
        results = {
          code: 10000,
          message: "该账号所在角色已被禁用,请联系管理员",
        };
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
        // console.log("token::"+access_token);
        const uid = user.id;
        await this.ctx.service.admin.login.saveToken({
          uid,
          access_token,
          refresh_token,
        });
        results = {
          code: 200,
          data: {
            access_token,
          },
        };
      }
    }
    this.ctx.body = results;
  }
}

module.exports = LoginController