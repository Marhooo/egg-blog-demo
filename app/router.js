'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const isLogin = middleware.verifyToken()
  const roleAndUseStatus = middleware.roleAndUseStatus()
  const editAdmin = middleware.editAdmin()


  router.get('/', controller.home.index);

  // 注册接口
  router.post("/admin/user/register", controller.admin.register.userRegister)
  // 登录接口
  router.post("/admin/user/login", controller.admin.login.userLogin)
  // 获取当前用户信息
  router.get("/user/getUserInfo", isLogin, controller.admin.login.getUserInfo)
  // 获取用户信息
  router.post("/user/getUserInfoId", isLogin, roleAndUseStatus, controller.admin.login.getUserInfoId)
  // 获取用户列表
  router.post("/user/userList", isLogin, roleAndUseStatus, controller.admin.user.userList)
  // 修改用户信息
  router.post("/user/editUserInfo", isLogin, roleAndUseStatus, editAdmin, controller.admin.user.editUserInfo)
  // 修改密码
  router.post("/user/editPassword", isLogin, roleAndUseStatus, controller.admin.user.editPassword)
  // 删除用户
  router.post("/user/delUser", isLogin, roleAndUseStatus, editAdmin, controller.admin.user.delUser)
  // 角色列表
  router.get("/permissions/getRoleList", isLogin, roleAndUseStatus, controller.admin.role.getRoleList)
  // 增加角色
  router.post("/permissions/addRole", isLogin, roleAndUseStatus, controller.admin.role.addRole)
  // 删除角色
  router.post("/permissions/delRole", isLogin, roleAndUseStatus, controller.admin.role.delRole)
  // 分配角色权限
  router.post("/permissions/rolePermissions", isLogin, roleAndUseStatus, controller.admin.role.rolePermissions)
  // 获取角色所拥有的权限
  router.post("/permissions/searchRolePermissions", isLogin, roleAndUseStatus, controller.admin.role.searchRolePermissions)

  /**************************************************************** */
  // 发表文章
  router.post("/article/addArticle", isLogin, controller.article.addArticle)
  // 文章列表
  router.post("/article/articleList", isLogin, controller.article.articleList)
  // 文章修改回显
  router.post("/article/getArticle", isLogin, controller.article.getArticle)
  // 删除文章
  router.post("/article/delArticle", isLogin, controller.article.delArticle)
  // 图片上传
  router.post("/editor/uploadImg", controller.article.uploadImg)
  // 发表评论
  router.post("/comment/addComment", isLogin, controller.comment.addComment)
};
