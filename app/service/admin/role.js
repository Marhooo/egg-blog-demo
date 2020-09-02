const Service = require('egg').Service

class RoleService extends Service{
    //获取角色列表
    async getRoleList(){
        const {ctx} = this
        let result
        await ctx.model.SystemRole.findAndCountAll().then(async res=>{
            result = res
            for (let i = 0; i < result.rows.length; i++) {
                if (result.rows[i].name === "超级管理员") {
                  result.rows[i].dataValues.disabled = true
                }
            }            
        }).catch(err=>{
            console.log(err)
        })
        return result
    }



}

module.exports = RoleService