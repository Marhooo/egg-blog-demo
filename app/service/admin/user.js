const Service = require("egg").Service;

class UserService extends Service{
    async editUserInfo(options){
        const{id} = options
        options.status = options.status ? "1" : "0"
        let results
        await this.ctx.model.SystemUser.update(options, {
          where: {
            id, // 查询条件
          },
        }).then(() => {
          results = {
            code: 200,
            message: "修改成功",
          }
        }).catch(err => {
          console.log(err)
          results = {
            code: 10000,
            message: err,
          }
        })
    
        return results
    }
}

module.exports = UserService