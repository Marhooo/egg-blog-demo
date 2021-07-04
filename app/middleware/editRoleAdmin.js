module.exports = () => {
  return async function (ctx, next) {
    try {
      let tagRoleName = null;
      const myRoleName = ctx.session.user.roleName;
      const tagRoleId = ctx.request.body.id;
      const resRole = await ctx.model.SystemRole.findByPk(tagRoleId);
      tagRoleName = resRole ? resRole.name : '';
      if (tagRoleName === '超级管理员' || myRoleName !== '超级管理员') {
        ctx.helper.error(200, 10020, '未获得此操作权限!');
      } else {
        await next();
      }
    } catch (error) {
      console.log(error);
      ctx.helper.error(200, 10404, '未知错误!');
    }
  };
};
