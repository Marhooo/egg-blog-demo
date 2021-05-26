const Service = require("egg").Service

class articleService extends Service {
  // 增加修改文章
  async saveOrUpArticle (data) {
    try {
      const result = await this.ctx.model.Article.upsert(data)
      if (result) {
        this.ctx.body = {
          code: 200,
          message: '文章添加成功',
        };
      } else {
        this.ctx.body = {
          code: 200,
          message: '文章更新成功',
        };
      }      
    } catch(err) {
      console.log(err);
      this.ctx.helper.error(200, 10204, '文章添加更新失败');      
    }
  }


  // 查询文章列表
  async articleList (options) {
    try {
      const { currentPage, pageSize } = options
      const result = await this.ctx.model.Article.findAndCountAll({
        limit: parseInt(pageSize),
        offset: parseInt(pageSize) * (parseInt(currentPage) - 1),        
      })
      //灰色部分代码有问题的根本原因是使用 promise 或 async 函数作为 forEach() 等类似方法的 callback 参数，导致队列接不到回执。
      // result.rows.forEach(async element => {
      //   const resUser = await this.ctx.model.SystemUser.findById(element.author)
      //   element.author = resUser.name
      // });
      for(let i = 0; i < result.rows.length; i++) {
        const resUser = await this.ctx.model.SystemUser.findById(result.rows[i].author)
        result.rows[i].author = resUser.name
      }
      this.ctx.body = result
    } catch(err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '查询失败');
    }
  }

  //查询具体标签文章列表
  async getArticleInLabel(options) {
    try {
      const {currentPage, pageSize, article_label} = options
      const result = await this.ctx.model.Article.findAndCountAll({
        limit: parseInt(pageSize),
        offset: parseInt(pageSize) * (parseInt(currentPage) - 1),
        where: {
          article_label: {
            like: `%${article_label}%`
          }
        }        
      })
      //这里查出来的已经有所有的列表count数量了
      this.ctx.body = result
    } catch(err) {
      console.log(err)
      this.ctx.helper.error(200, 10404, '查询失败');
    }
  }

  //文章回显
  async getArticle(aId){
    try{
      const articleresult = await this.ctx.model.Article.findById(aId)
      if(articleresult) {
        articleresult.read_num +=1
        await this.ctx.model.Article.update({
          read_num: articleresult.read_num
        }, {
          where: {
            id: aId
          }
        })
        return articleresult     
      } else {
        return articleresult
      }
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