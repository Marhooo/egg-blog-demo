const Service = require('egg').Service;

class ArticleLabelService extends Service {
  // 增加修改标签
  async saveOrUpArticleLabel(data) {
    try {
      const result = await this.ctx.model.ArticleLabel.upsert(data);
      //创建为true，更新为false
      if (result) {
        this.ctx.body = {
          code: 200,
          message: '标签添加成功',
        };
      } else {
        this.ctx.body = {
          code: 200,
          message: '标签更新成功',
        };
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '添加更新失败');
    }
  }

  // 查找文章标签
  async getArticleLabel(options) {
    try {
      const { label_name } = options;
      let result;
      if (label_name) {
        result = await this.ctx.model.ArticleLabel.findOne({
          where: {
            label_name: label_name,
          },
        });
      } else {
        result = await this.ctx.model.ArticleLabel.findAll();
      }
      if (result) {
        this.ctx.body = result;
      } else {
        this.ctx.helper.error(200, 10204, '未查询到相关数据');
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '查询失败');
    }
  }
}

module.exports = ArticleLabelService;
