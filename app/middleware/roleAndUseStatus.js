module.exports = () => {
    return async function (ctx, next) {
      const roleId = ctx.session.user.role_id
      const uid = ctx.session.user.id
  
      await ctx.model.SystemRole.findByPk(roleId).then(async res => {
        if (!res.status) {
          await ctx.helper.error(401, 10000, "该账号所在角色已被禁用,请联系管理员")
          return false
        }
        await ctx.model.SystemUser.findByPk(uid).then(async res => {
          if (res.status === "0") {
            await ctx.helper.error(401, 10000, "该账号已被禁用,请联系管理员")
            return false
          } else if (res.status === "2") {
            await ctx.helper.error(401, 10000, "该账号不存在")
            return false
          }
          await next()
  
        })
      })
    }
}