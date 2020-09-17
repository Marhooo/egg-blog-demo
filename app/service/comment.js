const { validate } = require("../../config/plugin");

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

  //回复评论
  async replyComment(data){
    let result = "";
    var replyRule = {
      to_user_id: "string",
      content: {
        type: "string",
        max: 70
      },
      comment_id: "string"
    }
    try{
      this.ctx.validate(replyRule)
      const res = await this.ctx.model.Reply.create(data);
      if(res){
        result = true
      }else{
        result = false
      }
      return result
    }catch(err){
      console.log(err)
      result = false;
      return result;
    }
  }


}
module.exports = CommentService
