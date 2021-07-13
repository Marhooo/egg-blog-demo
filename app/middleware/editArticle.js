module.exports = () => {
  return async function (ctx, next) {
    try {
      const myRoleName = ctx.session.user.roleName;
      const myId = ctx.session.user.id;
      const options = ctx.request.body;
      const articleResult = await ctx.model.Article.findByPk(options.id);
      if (options.id) {
        if (myRoleName === '管理员' || myRoleName === '超级管理员' || articleResult.author == myId) {
          await next();
        } else {
          ctx.helper.error(200, 10020, '您未获得操作此项目权限!');
        }
      } else {
        await next();
      }
    } catch (error) {
      console.log(error);
      ctx.helper.error(200, 10404, '未知错误!');
    }
  };
};
