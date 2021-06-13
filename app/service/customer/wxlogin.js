const Service = require('egg/index').Service;

class WxLoginService extends Service {
  //微信拿到openid后放入数据库，并换取token时考虑账号是否已经存在
  async wxRegisterLogin(options) {
    try {
      const { js_code, userInfo } = options;
      const wx = {
        appId: 'wxabd15cdb355480a5',
        appSecret: '95ecc98b57fd8551e24fc3056156b0e4',
      };
      const url =
        'https://api.weixin.qq.com/sns/jscode2session?appid=' +
        wx.appId +
        '&secret=' +
        wx.appSecret +
        '&js_code=' +
        js_code +
        '&grant_type=authorization_code';
      const resOidAndSkey = await this.ctx.curl(url, {
        dataType: 'json',
      });
      if (resOidAndSkey.data && resOidAndSkey.status === 200) {
        const roleinfo = await this.ctx.model.SystemRole.findOne({
          where: { name: '游客' },
        });
        const user = await this.ctx.service.customer.wxlogin.findOpenId(resOidAndSkey.data.openid);
        if (!user) {
          await this.ctx.model.SystemUser.create({
            username: 'wxlogin',
            password: 'wxlogin',
            openid: resOidAndSkey.data.openid,
            role_id: roleinfo.id,
            session_key: resOidAndSkey.data.session_key,
            name: userInfo.nickName,
            info: `${userInfo.province},${userInfo.city}`,
            avatar: userInfo.avatarUrl,
            sex: userInfo.gender == 1 ? 1 : 2,
          });
          const checkUser = await this.ctx.service.customer.wxlogin.findOpenId(
            resOidAndSkey.data.openid
          );
          if (checkUser) {
            const refresh_token = await this.ctx.helper.createToken(
              { id: checkUser.id },
              '7',
              'days'
            );
            const access_token = await this.ctx.helper.createToken(
              { id: checkUser.id },
              '2',
              'hours'
            );
            const uid = checkUser.id;
            await this.ctx.service.customer.wxlogin.saveToken({
              uid,
              access_token,
              refresh_token,
            });
            this.ctx.body = {
              code: 200,
              data: { access_token },
            };
          } else {
            this.ctx.helper.error(200, 10204, 'token获取失败');
          }
        } else {
          await this.ctx.model.SystemUser.update(
            {
              name: userInfo.nickName,
              info: `${userInfo.province},${userInfo.city}`,
              avatar: userInfo.avatarUrl,
              sex: userInfo.gender == 1 ? 1 : 2,
            },
            {
              where: {
                id: user.id,
              },
            }
          );
          const role = await this.ctx.model.SystemRole.findById(user.role_id);
          if (!role.status) {
            this.ctx.helper.error(200, 10020, '该账号所在角色已被禁用,请联系管理员');
          } else if (!user.status || user.status == '0') {
            this.ctx.helper.error(200, 10020, '该账号已被禁用,请联系管理员');
          } else {
            const refresh_token = await this.ctx.helper.createToken({ id: user.id }, '7', 'days');
            const access_token = await this.ctx.helper.createToken({ id: user.id }, '2', 'hours');
            const uid = user.id;
            await this.ctx.service.customer.wxlogin.saveToken({
              uid,
              access_token,
              refresh_token,
            });
            this.ctx.body = {
              code: 200,
              data: { access_token },
            };
          }
        }
      } else {
        this.ctx.helper.error(200, 10500, '微信侧微服务获取失败');
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, 'token获取失败');
    }
  }

  async findOpenId(openid) {
    const user = await this.ctx.model.SystemUser.findOne({
      where: { openid },
    });
    return user;
  }

  // 生成 token 保存数据库
  async saveToken(data) {
    await this.app.model.SystemToken.upsert(data);
  }

  //测试微信登录接口
  async wxLogin(options) {
    try {
      const { openid } = options;
      const user = await this.ctx.service.customer.wxlogin.findOpenId(openid);
      if (!user) {
        this.ctx.helper.error(200, 10204, 'openid用户不存在!');
      } else {
        const refresh_token = await this.ctx.helper.createToken({ id: user.id }, '7', 'days');
        const access_token = await this.ctx.helper.createToken({ id: user.id }, '2', 'hours');
        const uid = user.id;
        await this.ctx.service.customer.wxlogin.saveToken({
          uid,
          access_token,
          refresh_token,
        });
        this.ctx.body = {
          code: 200,
          data: { access_token },
        };
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, 'token获取失败');
    }
  }
}

module.exports = WxLoginService;
