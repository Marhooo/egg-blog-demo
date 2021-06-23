const Service = require('egg').Service;

class CommentService extends Service {
  //发表评论
  async addComment(options) {
    const transaction = await this.ctx.model.transaction()
    try {
      await this.ctx.model.Comment.create(options, transaction);
      const articleResult = await this.ctx.model.Article.findByPk(options.article_id);
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
            transaction
          },
        );
        await transaction.commit();
        this.ctx.body = {
          code: 200,
          message: '评论成功',
        };
      } else {
        this.ctx.helper.error(200, 10204, '评论失败');
      }
    } catch (err) {
      await transaction.rollback()
      console.log(err);
      this.ctx.helper.error(200, 10404, '评论失败');
    }
  }

  //回复评论
  async replyComment(options) {
    const transaction = await this.ctx.model.transaction()
    try {
      await this.ctx.model.Reply.create(options, transaction);
      const commentResult = await this.ctx.model.Comment.findByPk(options.comment_id);
      if (commentResult) {
        const articleResult = await this.ctx.model.Article.findByPk(commentResult.article_id);
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
              transaction
            }
          );
          await transaction.commit()
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
      await transaction.rollback()
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
        const user = await this.ctx.model.SystemUser.findByPk(comment.author_id);
        const article = await this.ctx.model.Article.findByPk(comment.article_id);
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
      //   user.push(await this.ctx.model.SystemUser.findByPk(comment.author_id));
      //   article.push(await this.ctx.model.Article.findByPk(comment.article_id));
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

  //某篇文章的评论列表(文章第一层评论附带3条reply)
  async getSingleArticleCommentList(options) {
    try {
      const { currentPage, pageSize, child_currentPage, child_pageSize, article_id } = options;
      const result = await this.ctx.model.Comment.findAndCountAll({
        limit: parseInt(pageSize),
        offset: parseInt(pageSize) * (parseInt(currentPage) - 1),
        order: [['created_at', 'DESC']], //按时间顺序返回，DESC按最新
        where: {
          article_id: article_id,
        },
      });
      for (let i = 0; i < result.rows.length; i++) {
        const resUser = await this.ctx.model.SystemUser.findByPk(result.rows[i].commenter_id);
        result.rows[i].dataValues.commenter = resUser.name;
        result.rows[i].dataValues.commenter_avatar = resUser.avatar
        const resReply = await this.ctx.model.Reply.findAndCountAll({
          limit: parseInt(child_pageSize),
          offset: parseInt(child_pageSize) * (parseInt(child_currentPage) - 1),
          order: [['created_at']],
          where: {
            to_user_id: result.rows[i].commenter_id,
            comment_id: result.rows[i].id,
          },
        });
        if (resReply) {
          for (let j = 0; j < resReply.rows.length; j++) {
            const resFromUser = await this.ctx.model.SystemUser.findByPk(resReply.rows[j].from_user_id);
            const resToUser = await this.ctx.model.SystemUser.findByPk(resReply.rows[j].to_user_id);
            const resToReplyUser = await this.ctx.model.SystemUser.findByPk(
              resReply.rows[j].to_reply_user_id
            );
            resReply.rows[j].dataValues.from_author = resFromUser.name;
            resReply.rows[j].dataValues.from_author_avatar = resFromUser.avatar;
            resReply.rows[j].dataValues.to_author = resToUser.name;
            if (resToReplyUser) {
              resReply.rows[j].dataValues.to_reply_author = resToReplyUser.name;
            }
          }
        }
        result.rows[i].dataValues.child_count = resReply.count;
        result.rows[i].dataValues.child = resReply.rows;
      }
      this.ctx.body = {
        code: 200,
        data: result,
      };
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '查询失败');
    }
  }

  //文章评论中对一个评论的回复讨论列表
  async getCommentReplyList(options) {
    try {
      const { currentPage, pageSize, comment_id } = options;
      const result = await this.ctx.model.Reply.findAndCountAll({
        limit: parseInt(pageSize),
        offset: parseInt(pageSize) * (parseInt(currentPage) - 1),
        order: [['created_at']],
        where: {
          comment_id: comment_id,
        },
      });
      for (let i = 0; i < result.rows.length; i++) {
        const resFromUser = await this.ctx.model.SystemUser.findByPk(result.rows[i].from_user_id);
        const resToUser = await this.ctx.model.SystemUser.findByPk(result.rows[i].to_user_id);
        const resToReplyUser = await this.ctx.model.SystemUser.findByPk(
          result.rows[i].to_reply_user_id
        );
        result.rows[i].dataValues.from_author = resFromUser.name;
        result.rows[i].dataValues.from_author_avatar = resFromUser.avatar;
        result.rows[i].dataValues.to_author = resToUser.name;
        if (resToReplyUser) {
          result.rows[i].dataValues.to_reply_author = resToReplyUser.name;
        }
      }
      this.ctx.body = {
        code: 200,
        data: result,
      };
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '查询失败');
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
