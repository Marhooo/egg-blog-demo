module.exports = () => {
  return async function (ctx, next) {
    let tagRoleName = "";
    let myRoleName = "";
    let uid = "";
    myRoleName = ctx.session.user.roleName;
    uid = ctx.request.body.id;
    if (uid) {
      await ctx.model.SystemUser.findById(uid).then(async (res) => {
        await ctx.model.SystemRole.findById(res.role_id).then((response) => {
          tagRoleName = response ? response.name : "";
        });
      });
    }
    if (tagRoleName === "超级管理员" && myRoleName !== "超级管理员") {
      ctx.helper.error(200, 10020, "未获得此操作权限");
    } else {
      await next();
    }
  };
};
