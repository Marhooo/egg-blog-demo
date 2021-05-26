const Controller = require('../core/base_controller');

class ArticleController extends Controller {
  // 发表文章
  async addArticle() {
    const articleData = this.ctx.request.body;
    articleData.article_label = articleData.article_label.join(',');
    articleData.author = this.ctx.session.user.id;
    await this.ctx.service.article.saveOrUpArticle(articleData);
  }

  // 查询文章列表
  async articleList() {
    const getListData = this.ctx.request.query;
    await this.ctx.service.article.articleList(getListData);
  }

  //查询具体标签类的文章
  async articleInLabel() {
    const options = this.ctx.request.query;
    await this.ctx.service.article.getArticleInLabel(options)
  }

  //文章回显
  async getArticle() {
    const id = this.ctx.request.body.id;
    const result = await this.ctx.service.article.getArticle(id);

    this.ctx.body = result;
  }

  // 删除文章
  async delArticle() {
    const id = this.ctx.request.body.id;
    const result = await this.ctx.service.article.delArticle(id);
    this.ctx.body = result;
  }

  // 富文本上传图片
  async uploadImg() {
    const imgurl = await this.ctx.helper.uploadImg();
    this.ctx.body = { errno: 0, data: [imgurl] };
  }
}

module.exports = ArticleController;
