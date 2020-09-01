'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 注册接口
  router.post("/admin/user/register", controller.admin.register.userRegister)
  // 登录接口
  router.post("/admin/user/login", controller.admin.login.userLogin)
};
