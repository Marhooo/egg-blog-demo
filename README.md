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
>- 另有一处代码```options.status = options.status ? "1" : "0"```需要解决,此处原著逻辑好像有点问题,如果修改内容status不写,会默认修改数据库status为0,而进一步导致账号状态被禁用

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