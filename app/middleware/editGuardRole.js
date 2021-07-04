module.exports = () => {
  return async function (ctx, next) {
    try {
      const myRoleName = ctx.session.user.roleName;
      if (myRoleName !== ('管理员' || '超级管理员')) {
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
