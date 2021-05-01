/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  
  config.security = {
    csrf: {
      enable: false,
    },
  },
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1598875395547_5934';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.jwt = {
    secret: "595485548",
    enable: false,
  };

  // config.cors = {
  //   origin: '*', // 匹配规则  域名+端口  *则为全匹配
  //   allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  //   credentials: true
  // };

  config.cors = {
    origin: ctx => ctx.get('origin'),
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true
  };

  return {
    ...config,
    ...userConfig,
  };
};
