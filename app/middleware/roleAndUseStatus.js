module.exports = () => {
  return async function (ctx, next) {
    try {
      const roleId = ctx.session.user.role_id;
      const uid = ctx.session.user.id;      
      const roleResult = await ctx.model.SystemRole.findByPk(roleId);
      if (!roleResult.status) {
        ctx.helper.error(401, 10000, '该账号所在角色已被禁用,请联系管理员!');
      } else {
        const userResult = await ctx.model.SystemUser.findByPk(uid);
        if (userResult.status === '0') {
          ctx.helper.error(401, 10000, '该账号已被禁用,请联系管理员!');
        } else if (userResult.status === '2') {
          ctx.helper.error(401, 10000, '该账号不存在!');
        } else {
          await next();
        }
      }
    } catch (err) {
      console.log(err);
      ctx.helper.error(200, 10404, '未知错误!');
    }
  };
};
