module.exports = (app) => {
  let { validator } = app;

  // 校验用户名是否正确
  validator.addRule('userName', (rule, value) => {
    if (/^1[3-9]\d{9}$/.test(value)) {
      return '用户名不能是手机格式!';
    } else if (value.length < 6 || value.length > 18) {
      return '用户名的长度应该在6-18之间';
    }
  });

  // 校验手机号码
  validator.addRule('userPhone', (rule, value) => {
    if (!/^1[3-9]\d{9}$/.test(value)) {
      return '请准确输入手机格式!';
    }
  });

};
