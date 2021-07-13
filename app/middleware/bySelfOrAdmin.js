module.exports = () => {
  return async function (ctx, next) {
    try {
      let tagRoleName = null;
      const myRoleName = ctx.session.user.roleName;
      const myId = ctx.session.user.id;
      const targetUid = ctx.request.body.id;
      const resUser = await ctx.model.SystemUser.findByPk(targetUid);
      const resRole = await ctx.model.SystemRole.findByPk(resUser.role_id);
      tagRoleName = resRole ? resRole.name : '';
      if (tagRoleName === '超级管理员') {
        if (myRoleName === '超级管理员') {
          await next();
        } else {
          ctx.helper.error(200, 10020, '系统最高权限不可以操作!');
        }
      } else {
        if (myId === targetUid) {
          await next();
        } else if (myRoleName === '超级管理员') {
          await next();
        } else {
          ctx.helper.error(200, 10020, '您未获得此操作权限!');
        }
      }
    } catch (error) {
      console.log(error);
      ctx.helper.error(200, 10404, '未知错误!');
    }
  };
};
