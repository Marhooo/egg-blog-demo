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


  //评论列表
  async commentList(getListData){
    const {currentPage = 1, pageSize = 10} = getListData
    let results = []
    try {
      let res = await this.ctx.model.Comment.findAndCountAll({
        limit: pageSize,
        offset: pageSize * (currentPage - 1)
      })
      for(let i=0; i < res.rows.length; i++){
        const comment = res.rows[i];
        //console.log(comment);
        const user = await this.ctx.model.SystemUser.findById(comment.author_id);
        const article = await this.ctx.model.Article.findById(comment.article_id);
        results.push({
          ...comment.toJSON(),
          author_name : user.name,
          article_title : article.title
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
      return results
    }catch(err){
      console.log(err)
      results = {
        code: 10000,
        message: err.message
      }
      return results
    }
  }

  //删除评论
  async delComment(cId){
    let results
    try{
      this.ctx.validate({
        id: "string"
      })
      const res = await this.ctx.model.Comment.destroy({
        where:{
          id: cId
        }
      })
      if(res>0){
        results = {
          code: 200,
          message: "删除成功",
        }
      }else{
        results = {
          code: 10000,
          message: "删除失败",
        }
      }
      return results
    }catch(err){
      console.log(err)
      results = {
        code: 10000,
        message: err.message
      }
      return results
    }
  }

}
module.exports = CommentService
