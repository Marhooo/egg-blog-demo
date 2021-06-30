const Service = require('egg/index').Service;

class WxLoginService extends Service {
  //微信小程序发来请求有两种情况：1.重新授权用户信息和手机信息后发来的请求。 2.一般微信小程序请求后台登录拿token
  async wxRegisterLogin(options) {
    try {
      const transaction = await this.ctx.model.transaction();
      const { js_code } = options;
      const url =
        'https://api.weixin.qq.com/sns/jscode2session?appid=' +
        this.app.config.wechat.appid +
        '&secret=' +
        this.app.config.wechat.appSecret +
        '&js_code=' +
        js_code +
        '&grant_type=authorization_code';
      const resOidAndSkey = await this.ctx.curl(url, {
        dataType: 'json',
      });
      //console.log(resOidAndSkey)     
      if ( resOidAndSkey.status === 200 && !resOidAndSkey.data.errcode) {
        if(options.userEncryptedData && options.phoneEncryptedData && options.userIv && options.phoneIv) {
          //微信小程序重新授权用户信息和手机信息后发来的请求
          let userInfo = this.ctx.helper.wxUserDecryptData(resOidAndSkey.data.session_key, options.userEncryptedData, options.userIv)
          let userPhoneInfo = this.ctx.helper.wxUserDecryptData(resOidAndSkey.data.session_key, options.phoneEncryptedData, options.phoneIv)
          const roleInfo = await this.ctx.model.SystemRole.findOne({
            where: { name: '游客' },
          });
          const user = await this.ctx.model.SystemUser.findOne({
            where: { openid: resOidAndSkey.data.openid }
          });
          if (!user) {
            await this.ctx.model.SystemUser.create({
              username: 'wxlogin',
              password: 'wxlogin',
              openid: resOidAndSkey.data.openid,
              unionid: resOidAndSkey.data.unionid,
              role_id: roleInfo.id,
              session_key: resOidAndSkey.data.session_key,
              name: userInfo.nickName,
              info: `${userInfo.province},${userInfo.city}`,
              avatar: userInfo.avatarUrl,
              sex: userInfo.gender == 1 ? '1' : '2',
              mobile_phone: userPhoneInfo.phoneNumber
            }, {transaction});
            const checkUser = await this.ctx.model.SystemUser.findOne({
              where: { openid: resOidAndSkey.data.openid }
            });
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
              await this.ctx.model.SystemToken.upsert({
                uid,
                access_token,
                refresh_token,
              }, {transaction});
              await transaction.commit();
              this.ctx.body = {
                code: 200,
                data: { access_token },
              };
            } else {
              await transaction.rollback();
              this.ctx.helper.error(200, 10204, 'token获取失败');
            }
          } else {
            await this.ctx.model.SystemUser.update(
              {
                name: userInfo.nickName,
                info: `${userInfo.province},${userInfo.city}`,
                avatar: userInfo.avatarUrl,
                sex: userInfo.gender == 1 ? '1' : '2',
                mobile_phone: userPhoneInfo.phoneNumber
              },
              {
                where: {
                  id: user.id,
                },
                transaction
              }
            );
            const role = await this.ctx.model.SystemRole.findByPk(user.role_id);
            if (!role.status) {
              this.ctx.helper.error(200, 10020, '该账号所在角色已被禁用,请联系管理员');
            } else if (!user.status || user.status == '0') {
              this.ctx.helper.error(200, 10020, '该账号已被禁用,请联系管理员');
            } else {
              const refresh_token = await this.ctx.helper.createToken({ id: user.id }, '7', 'days');
              const access_token = await this.ctx.helper.createToken({ id: user.id }, '2', 'hours');
              const uid = user.id;
              await this.ctx.model.SystemToken.upsert({
                uid,
                access_token,
                refresh_token,
              }, {transaction});
              await transaction.commit();
              this.ctx.body = {
                code: 200,
                data: { access_token },
              };
            }
          }
        } else {
          //微信小程序的平常登录情况
          const user = await this.ctx.model.SystemUser.findOne({
            where: { openid: resOidAndSkey.data.openid }
          });
          const role = await this.ctx.model.SystemRole.findByPk(user.role_id);
          if (!role.status) {
            this.ctx.helper.error(200, 10020, '该账号所在角色已被禁用,请联系管理员');
          } else if (!user.status || user.status == '0') {
            this.ctx.helper.error(200, 10020, '该账号已被禁用,请联系管理员');
          } else {
            const refresh_token = await this.ctx.helper.createToken({ id: user.id }, '7', 'days');
            const access_token = await this.ctx.helper.createToken({ id: user.id }, '2', 'hours');
            const uid = user.id;
            await this.ctx.model.SystemToken.upsert({
              uid,
              access_token,
              refresh_token,
            }, {transaction});
            await transaction.commit();
            this.ctx.body = {
              code: 200,
              data: { access_token },
            };
          }         
        }
      } else {
        await transaction.rollback();
        this.ctx.helper.error(200, 10500, '微信侧微服务获取失败');
      }
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      this.ctx.helper.error(200, 10404, 'token获取失败');
    }
  }

  //测试微信登录接口
  async wxLogin(options) {
    try {
      const { openid } = options;
      const user = await this.ctx.model.SystemUser.findOne({
        where: { openid: openid }
      });
      if (!user) {
        this.ctx.helper.error(200, 10204, 'openid用户不存在!');
      } else {
        const refresh_token = await this.ctx.helper.createToken({ id: user.id }, '7', 'days');
        const access_token = await this.ctx.helper.createToken({ id: user.id }, '2', 'hours');
        const uid = user.id;
        await this.ctx.model.SystemToken.upsert({
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
