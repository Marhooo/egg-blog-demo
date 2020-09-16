const Service = require("egg").Service;

class CommentService extends Service {
  //发表评论
  async addComment(data) {
    let result = "";
    try {
      this.ctx.validate({
        content: "string",
      });
      const res = await this.ctx.model.Comment.create(data);
      if (res) {
        result = true;
      } else {
        result = false;
      }
      return result;
    } catch (err) {
      console.log(err)
      result = false;
      return result;
    }
  }


}
module.exports = CommentService
