'use strict';

exports.sequelize = {
  enabled: true,
  package: "egg-sequelize",
}

exports.jwt = {
  enable: true,
  package: "egg-jwt",
}

exports.validate = {
  enable: true,
  package: 'egg-validate',
}

exports.session = {
  key: 'EGG_SESS',
  maxAge: 7 * 24 * 3600 * 1000, // 7 天
  httpOnly: true,
  encrypt: true,
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
}