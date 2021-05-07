module.exports = () => {
  return async function (ctx, next) {
    let tagRoleName = null;
    const myRoleName = ctx.session.user.roleName;
    const targetUid = ctx.request.body.id;
    try {
      const resUser = await ctx.model.SystemUser.findById(targetUid)
      const resRole = await ctx.model.SystemRole.findById(resUser.role_id)
      tagRoleName = resRole ? resRole.name : "";
      if (tagRoleName === "超级管理员" || myRoleName !== "超级管理员") {
        ctx.helper.error(200, 10020, "未获得此操作权限");
      } else {
        await next()
      }
    } catch (error) {
      console.log(error)
    }
  };
};
