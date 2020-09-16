const Controller = require("../core/base_controller");

class CommentController extends Controller {
  // 发表评论
  async addComment() {
    let result = {};
    const commentData = this.ctx.request.body;
    commentData.author_id = this.ctx.session.user.id;
    const commentResult = await this.ctx.service.comment.addComment(commentData);
    if (commentResult) {
      result = {
        code: 200,
        message: "评论成功",
      };
    } else {
      result = {
        code: 10000,
        message: "评论失败,请重试",
      };
    }
    this.ctx.body = result;
  }


}
module.exports = CommentController