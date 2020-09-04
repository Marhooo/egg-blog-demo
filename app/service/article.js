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
}

module.exports = articleService