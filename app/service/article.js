const Service = require("egg").Service

class articleService extends Service {
  // 增加修改文章
  async seaveOrUpArticle (data) {
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
    const { currentPage = 1, pageSize = 10, sort } = getListData
    await this.ctx.model.Article.findAndCountAll({
      limit: pageSize,
      offset: pageSize * (currentPage - 1),
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

  
}

module.exports = articleService