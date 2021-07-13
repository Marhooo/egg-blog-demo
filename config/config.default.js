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

  config.jwt = {
    secret: "595485548",
    enable: false,
  };

  config.validate = {
    // convert: false,
    // validateRoot: false,
  };  

  config.cors = {
    origin: ctx => ctx.get('origin'),      //匹配规则  域名+端口  *则为全匹配
    allowMethods: 'GET,HEAD,POST,PATCH',
    credentials: true
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  userConfig.wechat = {
    appid: 'wxabd15cdb355480a5',
    mchid: 1526312241,
    serial_no: "1A2CEAD5617A2E017132CCA4AAAC10C1FA265703",
    appSecret: '95ecc98b57fd8551e24fc3056156b0e4'
  }
  
  return {
    ...config,
    ...userConfig,
  };
};
