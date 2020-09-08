const Controller = require("../core/base_controller")

class ArticleController extends Controller {
  // 发表文章
  async addArticle () {
    let result = {}
    const articleData = this.ctx.request.body
    // articleData.id = articleData.id ? articleData.id: null
    articleData.author = this.ctx.session.user.id
    const articleResult = await this.ctx.service.article.seaveOrUpArticle(articleData)
    if (articleResult == true) {
      result = {
        code: 200,
        message: "文章发布成功",
      }
    } else {
      result = {
        code: 10000,
        message: "文章发布失败,请重试",
      }
    }
    this.ctx.body = result
  }


  // 查询文章列表
  async articleList () {
    const getListData = this.ctx.request.body
    const list = await this.ctx.service.article.articleList(getListData)

    this.ctx.body = list
  }
}

module.exports = ArticleController