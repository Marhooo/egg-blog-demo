module.exports = () => {
  return async function (ctx, next) {
    try {
      const options = ctx.request.body;
      const userInfo = await ctx.model.SystemUser.findOne({
        where: {
          mobile_phone: options.mobile_phone,
        },
      });
      if (!userInfo) {
        await next();
      } else {
        ctx.helper.error(200, 10404, '此手机号码已被注册!');
      }
    } catch (error) {
      console.log(error);
      ctx.helper.error(200, 10404, '未知错误!');
    }
  };
};
