const Service = require("egg").Service

class articleService extends Service {
  // 增加修改文章
  async saveOrUpArticle (data) {
    let result = ""
    await this.ctx.model.Article.upsert(data).then(res => {
      console.log(res)
      result = true
    }).catch(err => {
      console.log(err)
      result = false
    })

    return result
  }


  // 查询文章列表
  async articleList (getListData) {
    const { ctx } = this
    let result
    //const { currentPage = 1, pageSize = 10, sort } = getListData
    const { currentPage, pageSize } = getListData
    await this.ctx.model.Article.findAndCountAll({
      limit: parseInt(pageSize),
      offset: parseInt(pageSize) * (parseInt(currentPage) - 1),
    }).then(async res => {
      console.log(res)
      for (let i = 0; i < res.rows.length; i++) {
        await ctx.model.SystemUser.findById(res.rows[i].author).then(resUser => {
          res.rows[i].author = resUser.name
        }).catch(erruser => {
          console.log(erruser)
        })
      }
      result = res
    }).catch(err => {
      console.log(err)
    })
    return result
  }

  //文章回显
  async getArticle(aId){
    try{
      return await this.ctx.model.Article.findById(aId)
    }catch(err){
      console.log(err)
    }
  }

  //删除文章
  async delArticle(aId){
    let results
    try{
      this.ctx.validate({
        id: 'string'
      })
      const res = await this.ctx.model.Article.destroy({
        where:{
          id: aId
        }
      })
      if(res>0){
        results = {
          code: 200,
          message: "删除成功"
        }
      }else{
        results = {
          code: 10000,
          message: "删除失败"
        }
      }
      return results
    }catch(err){
      results = {
        code: 10000,
        message: err.message
      }
      return results
    }
  }

  
}

module.exports = articleService