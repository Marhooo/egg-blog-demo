'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const isLogin = middleware.verifyToken()
  const roleAndUseStatus = middleware.roleAndUseStatus()
  const editAdmin = middleware.editAdmin()
  const editRoleAdmin = middleware.editRoleAdmin()
  const editGuardRole = middleware.editGuardRole()
  const editArticle = middleware.editArticle()


  router.get('/', controller.home.index);


  //测试接口
  router.get("/testapi", controller.admin.atest.testapi)
  // 注册接口
  router.post("/admin/user/register", controller.admin.register.userRegister)
  //测试用的微信登录接口换取token
  router.post("/customer/user/wxLogin", controller.customer.wxlogin.wxLogin)
  // 微信小程序注册/登录接口(换取token)
  router.post("/customer/user/wxRegisterLogin", controller.customer.wxlogin.wxRegisterLogin)
  // 后台登录接口
  router.post("/admin/user/login", controller.admin.login.userLogin)
  // 登出接口
  router.post("/admin/user/logout", isLogin, roleAndUseStatus, controller.admin.login.userLogout)
  // 获取当前用户信息且session绑定
  router.get("/user/getUserInfo", controller.admin.login.getUserInfo)
  // 获取用户信息
  router.post("/user/getUserInfoId", isLogin, roleAndUseStatus, controller.admin.login.getUserInfoId)
  // 获取用户列表
  router.get("/user/userList", isLogin, roleAndUseStatus, controller.admin.user.userList)
  // 修改用户信息
  router.post("/user/editUserInfo", isLogin, roleAndUseStatus, editAdmin, controller.admin.user.editUserInfo)
  // 修改密码
  router.post("/user/editPassword", isLogin, roleAndUseStatus, controller.admin.user.editPassword)
  // 删除用户
  router.post("/user/delUser", isLogin, roleAndUseStatus, editAdmin, controller.admin.user.delUser)
  // 角色列表
  router.get("/permissions/getRoleList", isLogin, roleAndUseStatus, controller.admin.role.getRoleList)
  // 增加角色
  router.post("/permissions/addRole", isLogin, editRoleAdmin, roleAndUseStatus, controller.admin.role.addRole)
  // 删除角色
  router.post("/permissions/delRole", isLogin, editRoleAdmin, roleAndUseStatus, controller.admin.role.delRole)
  // 分配角色权限
  router.post("/permissions/rolePermissions", isLogin, editRoleAdmin, roleAndUseStatus, controller.admin.role.rolePermissions)
  // 获取角色所拥有的权限
  router.post("/permissions/searchRolePermissions", isLogin, roleAndUseStatus, controller.admin.role.searchRolePermissions)
  /**************************************************************** */

  //添加修改学术领域块
  router.post("/academic/addAcademicField", isLogin, roleAndUseStatus, controller.academicfield.addAcademicField)
  //查找学术领域
  router.get("/academic/getAcademicField", isLogin, roleAndUseStatus, controller.academicfield.getAcademicField)
  //添加修改文章标签
  router.post("/articlelabel/addArticleLabel", isLogin, roleAndUseStatus, controller.articlelabel.addArticleLabel)
  //查找文章标签
  router.get("/articlelabel/getArticleLabel", isLogin, roleAndUseStatus, controller.articlelabel.getArticleLabel)
  //获取轮播图标签add_num前四
  router.get("/articlelabel/getBannerLabel", isLogin, roleAndUseStatus, controller.articlelabel.getBannerLabel)

  /**************************************************************** */

  // 发表&修改文章
  router.post("/article/addArticle", isLogin, roleAndUseStatus, editArticle, controller.article.addArticle)
  // 文章列表
  router.get("/article/articleList", isLogin, roleAndUseStatus, controller.article.articleList)
  //获取具体标签文章列表
  router.get("/article/articleInLabel", isLogin, roleAndUseStatus, controller.article.articleInLabel)
  //查询热门文章
  router.get("/article/articleHot", isLogin, roleAndUseStatus, controller.article.articleHot)
  //搜索你感兴趣的文章
  router.get("/article/articleInterested", isLogin, roleAndUseStatus, controller.article.articleInterested)
  //文章点赞
  router.post("/article/adcArticleLike", isLogin, roleAndUseStatus, controller.article.adcArticleLike)
  //获取点赞相关用户信息
  router.get("/article/articleLike", isLogin, roleAndUseStatus, controller.article.getLikeUser)
  // 文章回显
  router.post("/article/getArticle", isLogin, roleAndUseStatus, controller.article.getArticle)
  // 删除文章
  router.post("/article/delArticle", isLogin, roleAndUseStatus, editGuardRole, controller.article.delArticle)
  // 图片上传
  router.post("/editor/uploadImg", controller.article.uploadImg)
  // 发表评论
  router.post("/comment/addComment", isLogin, roleAndUseStatus, controller.comment.addComment)
  // 回复评论
  router.post("/comment/replyComment", isLogin, roleAndUseStatus, controller.comment.replyComment)
  // 评论总列表
  router.get("/comment/commentList", isLogin, roleAndUseStatus, controller.comment.commentList)
  // 某篇文章的评论列表
  router.post("/comment/singleArticleCommentList", isLogin, roleAndUseStatus, controller.comment.singleArticleCommentList)
  // 文章评论中对某评论的回复列表
  router.post("/comment/commentReplyList", isLogin, roleAndUseStatus, controller.comment.commentReplyList)
  // 删除评论
  router.post("/comment/delComment", isLogin, roleAndUseStatus, editGuardRole, controller.comment.delComment)

  /**************************************************************** */

  //创建支付订单
  router.post("/payment/addPayOrder", isLogin, roleAndUseStatus, controller.customer.payment.addPayOrder)
  //小程序支付统一下单接口
  router.post("/payment/payWechatMini", isLogin, roleAndUseStatus, controller.customer.payment.payWechatMini)
  //查询微信小程序订单状态
  router.get("/payment/inquirePayWechatMini", isLogin, roleAndUseStatus, controller.customer.payment.inquirePayWechatMini)
  //查询微信支付订单列表
  router.post("/payment/inquirePayList", isLogin, roleAndUseStatus, controller.customer.payment.inquirePayList)

  /**************************************************************** */

  //游戏文件下载
  router.get("/flie/downloadFile", controller.gamemonitor.downloadGameFile)
  //添加IMEI返回激活码
  router.post("/gamemonitoe/addGameRawData", isLogin, roleAndUseStatus, controller.gamemonitor.addGameRawData)
  //远程失落大陆脚本锁
  router.get("/gamemonitoe/lostVerify", controller.gamemonitor.lostVerify)
};
