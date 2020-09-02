const Service = require("egg").Service;

class UserService extends Service{
  // 获取用户列表
  async userList (getListData) {
    let result
    const { currentPage = 1, pageSize = 10 } = getListData
    await this.ctx.model.SystemUser.findAndCountAll({
      limit: pageSize,
      offset: pageSize * (currentPage - 1),
    }).then(async res => {
      console.log(res)
      result = res
    }).catch(err => {
      console.log(err)
    })
    return result
  }

  //修改用户信息
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