const Controller = require("../core/base_controller")

class ArticleLabelController extends Controller {
  // 添加标签
  async addArticleLabel () {
    const labelData = this.ctx.request.body
    await this.ctx.service.articlelabel.saveOrUpArticleLabel(labelData)
  }

  // 查找标签
  async getArticleLabel() {
    const options = this.ctx.request.query;
    await this.ctx.service.articlelabel.getArticleLabel(options);
    //把this.ctx.body写在service层，更优雅的去处理错误
  }  

}

module.exports = ArticleLabelController