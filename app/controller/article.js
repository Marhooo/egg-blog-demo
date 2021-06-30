const await = require('await-stream-ready/lib/await');
const Controller = require('../core/base_controller');

class ArticleController extends Controller {
  // 发表文章
  async addArticle() {
    try {
      const Rule = {
        title: {
          type: 'string',
          max: 20
        },
        describe: {
          type: 'string',
          max: 60
        },
        article_label: 'array'
      }
      this.ctx.validate(Rule)
      const articleData = this.ctx.request.body;
      articleData.author = this.ctx.session.user.id;
      await this.ctx.service.article.saveOrUpArticle(articleData);
    } catch(err) {
      err.errors.forEach(element => {
        element.warn = '参数错误!'
      });
      this.ctx.helper.error(200, 10030, err.errors)
    }
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

  //查询热门文章
  async articleHot() {
    const options = this.ctx.request.query;
    await this.ctx.service.article.getArticleHot(options)
  }

  //搜你感兴趣的文章
  async articleInterested() {
    const options = this.ctx.request.query
    await this.ctx.service.article.getArticleInterested(options)
  }

  //文章点赞或取消点赞
  async adcArticleLike() {
    const options = this.ctx.request.body
    options.user_id = this.ctx.session.user.id;
    await this.ctx.service.article.adcArticleLike(options)
  }

  //获取点赞相关用户信息
  async getLikeUser() {
    const options = this.ctx.request.query
    await this.ctx.service.article.getLikeUser(options)
  }

  //文章回显
  async getArticle() {
    const id = this.ctx.request.body.id;
    const result = await this.ctx.service.article.getArticle(id);

    this.ctx.body = result;
  }

  // 删除文章
  async delArticle() {
    const options = this.ctx.request.body
    await this.ctx.service.article.delArticle(options);
  }

  // 富文本上传图片
  async uploadImg() {
    const imgurl = await this.ctx.helper.uploadImg();
    this.ctx.body = { errno: 0, data: [imgurl] };
  }

}

module.exports = ArticleController;
