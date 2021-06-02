const Service = require('egg').Service;

class CommentService extends Service {
  //发表评论
  async addComment(options) {
    try {
      await this.ctx.model.Comment.create(options);
      const articleResult = await this.ctx.model.Article.findById(options.article_id);
      if (articleResult) {
        articleResult.comment_num += 1;
        await this.ctx.model.Article.update(
          {
            comment_num: articleResult.comment_num,
          },
          {
            where: {
              id: options.article_id,
            },
          }
        );
        this.ctx.body = {
          code: 200,
          message: '评论成功',
        };
      } else {
        this.ctx.helper.error(200, 10204, '评论失败');
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '评论失败');
    }
  }

  //回复评论
  async replyComment(options) {
    try {
      await this.ctx.model.Reply.create(options);
      const commentResult = await this.ctx.model.Comment.findById(options.comment_id);
      if (commentResult) {
        const articleResult = await this.ctx.model.Article.findById(commentResult.article_id);
        if (articleResult) {
          articleResult.comment_num += 1;
          await this.ctx.model.Article.update(
            {
              comment_num: articleResult.comment_num,
            },
            {
              where: {
                id: articleResult.id,
              },
            }
          );
          this.ctx.body = {
            code: 200,
            message: '回复评论成功',
          };
        } else {
          this.ctx.helper.error(200, 10204, '回复评论失败');
        }
      } else {
        this.ctx.helper.error(200, 10204, '回复评论失败');
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '回复评论失败');
    }
  }

  //评论列表
  async commentList(getListData) {
    const { currentPage, pageSize } = getListData;
    let results = {
      rows: [],
    };
    try {
      let res = await this.ctx.model.Comment.findAndCountAll({
        limit: parseInt(pageSize),
        offset: parseInt(pageSize) * (parseInt(currentPage) - 1),
      });
      for (let i = 0; i < res.rows.length; i++) {
        const comment = res.rows[i];
        //console.log(comment.toJSON());
        //console.log({haha: comment})
        const user = await this.ctx.model.SystemUser.findById(comment.author_id);
        const article = await this.ctx.model.Article.findById(comment.article_id);
        //console.log(user)
        results.rows.push({
          ...comment.toJSON(),
          author_name: user.name,
          article_title: article.title,
        });
      }

      // let user = [];
      // let article = [];
      // for(let i=0; i < res.rows.length; i++){
      //   const comment = res.rows[i];
      //   user.push(await this.ctx.model.SystemUser.findById(comment.author_id));
      //   article.push(await this.ctx.model.Article.findById(comment.article_id));
      // }
      // results = res.rows.map((x, i)=>{
      //   return{
      //     ...x.toJSON(),
      //     author_name : user[i].name,
      //     article_title : article[i].title
      //   }
      // })
      return results;
    } catch (err) {
      console.log(err);
      results = {
        code: 10000,
        message: err.message,
      };
      return results;
    }
  }

  //删除评论
  async delComment(cId) {
    let results;
    try {
      this.ctx.validate({
        id: 'string',
      });
      const res = await this.ctx.model.Comment.destroy({
        where: {
          id: cId,
        },
      });
      if (res > 0) {
        results = {
          code: 200,
          message: '删除成功!',
        };
      } else {
        results = {
          code: 10000,
          message: '删除失败!',
        };
      }
      return results;
    } catch (err) {
      console.log(err);
      results = {
        code: 10000,
        message: err.message,
      };
      return results;
    }
  }

  //点赞 可以分文章点赞和评论点赞
}
module.exports = CommentService;
