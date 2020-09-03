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
};
