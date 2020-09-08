# eggserver
*Alt+M快捷键Markdown*
#### 0901 login和register完成
>- findById方法注意sequelize的版本
>- ```replace(/-/g, "")```用于格式化日期，如2016-1-1格式化为201611,```/g ```代表全局，所有的```- ```都替换
#### 0902 获取当前用户信息&&获取用户信息完成
>- 修改了getAccessToken ()中```return bearerToken && bearerToken.replace("Bearer ", "")```这段代码,在Bearer后面加了一个*空格*,方便Postman加入Bearer Token,这样在前端vue代码中也需要修改了.
#### 0902 获取用户列表&&修改用户信息完成
>- ```list.rows[i].dataValues.roleName = roleList.rows[j].name```sequelize查出来的数据都会包在dataValues里面
>- 在controller/admin/login.js中,完成用户登陆后需要直接去调用getUserInfo (),```this.ctx.session.user = userInfo```会把userInfo直接写入session中,且在前一行代码```const userInfo = await this.ctx.service.admin.login.getUserInfo(result)```中会去生成另外几个键例如```"roleName"```,为了后面的代码做工作
>- 三目运算,```tagRoleName = response ? response.name : ""```中表示response是否存在?存在的话```tagRoleName=response.name```,不存在的话```tagRoleName = ""```
>- [findAndCountAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAndCountAll)的使用查看文档
#### 0903 修改密码&&增加角色完成
>- 在修改密码editPassword()中,修改密码成功需要重新登录,后台是没有写逻辑的.所以在前端页面中需强制登出且重新登录,重写逻辑
>- 与原著中注释有出入,角色的增加和修改都写在了一个api中,前提条件是不能修改超级管理员角色
>- ```const { id = null, name, describe, status } = options```中```id=null```表示id默认为空,不是赋值的意思   整句代码解构语句
>- 在/controller/admin/user.js中原著```const myPassword = this.ctx.session.admin.user.password```这段代码有bug,admin应该去掉,应该是```const myPassword = this.ctx.session.user.password```
#### 0903 删除用户&&获取角色列表&&删除角色
>- 无论在删除用户delUser()中还是在中间件editAdmin中,用户的role_id用于映射SystemRole权限表中的外键至关重要,如果用户的role_id不存在就会导致程序错误退出
>- 在原著中获取角色列表的路由是post,改成get
>- 整篇代码async和promise混着写,一塌糊涂
>- ```await ctx.model.SystemRole.findById(rid).then(async res => {}```代码中sequelize返回一个 promise，这个 promise resolve 后返回一个数字,所以如果找到了结果,res的值就是找到的结果的数值.
#### 0904 分配角色权限&&获取角色所拥有的权限&&增加修改文章
>- /controller/article.js中addArticle ()里if判断修改成```if (articleResult == true) {}```
#### 0908 查询文章列表
>- 暂无









## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org