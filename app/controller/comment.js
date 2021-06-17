const Controller = require("../core/base_controller");

class CommentController extends Controller {
  // 发表评论
  async addComment() {
    //在controller层抛出字段校验错误。好处是防止service层里重要服务端信息被抛出。
    try{
      this.ctx.validate({
        content: 'string',
      });
      const commentData = this.ctx.request.body;
      commentData.commenter_id = this.ctx.session.user.id;    
      await this.ctx.service.comment.addComment(commentData)
    } catch(err) {
      err.warn = '参数错误'
      this.ctx.helper.error(200, 10030, err);
    }
  }

  // 回复评论
  async replyComment () {
    try {
      const replyRule = {
        to_user_id: 'string',
        content: {
          type: 'string',
          max: 60,
        },
        comment_id: 'string',
      };
      this.ctx.validate(replyRule)
      const replyData = this.ctx.request.body
      replyData.from_user_id = this.ctx.session.user.id
      await this.ctx.service.comment.replyComment(replyData)      
    } catch(err) {
      err.warn = '参数错误'
      this.ctx.helper.error(200, 10030, err);
    }
  }
  
  // 评论总列表
  async commentList () {
    const getListData = this.ctx.request.query
    const list = await this.ctx.service.comment.commentList(getListData)

    this.ctx.body = list
  }

  // 查询出某篇文章的评论列表
  async singleArticleCommentList () {
    const getListData = this.ctx.request.body
    await this.ctx.service.comment.getSingleArticleCommentList(getListData)
  }

  // 查询文章评论中对一个评论的回复讨论列表
  async commentReplyList() {
    const getListData = this.ctx.request.body
    await this.ctx.service.comment.getCommentReplyList(getListData)    
  }

  // 删除评论
  async delComment () {
    const id = this.ctx.request.body.id
    const result = await this.ctx.service.comment.delComment(id)
    this.ctx.body = result
  }


}
module.exports = CommentController