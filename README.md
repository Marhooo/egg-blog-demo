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
#### 0913 文章修改回&&删除文章
>- 这两块的代码自己完成了修正，由于原著中的代码async和promise混着乱写。我全部改成了async和await的写法，并且完成了egg-validate的添加，保证了简单的校验和错误异常的抛出。把校验层写在了service中，因为错误的抓取是写在了service层中。
>- service层中```this.ctx.validate({id: 'string'})```此处的id是指ctx.request.body中是否有id且是否为string，并不是调用controller层中const的那个id。
#### 0916 文件上传接口&&发表文章评论
>- Node中的 Stream 模式上传，参考[Stream](https://eggjs.org/zh-cn/basics/controller.html#stream-%E6%A8%A1%E5%BC%8F),上传文件失败的话必须将上传的文件流消费掉,就需要用到```stream-wormhole```。
>- postman进行文件上传测试选择form-data，text改为file，输入key：file  ，value：选择文件。
>- model.create用法参考[Sequelize](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-create)
#### 0917 回复评论
>- 在回复评论中自定义了校验规则，```var replyRule = {to_user_id: "string",content: {type: "string", max: 70}, comment_id: "string"}```,校验时```this.ctx.validate(replyRule)```默认校验就是this.ctx.request.body中的内容，不需要指明。参考egg文档[validate](https://eggjs.org/zh-cn/tutorials/restful.html#controller-%E5%BC%80%E5%8F%91)
#### 0921 评论列表&&删除评论
>- 卡了好几天，完成了对评论列表的数据库查询及查询结果的添加另外author_name和article_title这两个键，都是从第一张comment表中的author_id和article_id键去另外两张表中找对应的author_name和article_title，然后一并添加到一个results中。整个代码有2中方式写法，一个是空数组中push方法（3个数据库查询结果表数组的解构赋值），还有一个是第一张表原数组map方法（对另两个新数组解构赋值）。其中还有一个莫名其妙的bug就是.toJSON()在```...comment.toJSON()```中必须要加上，也不知道为什么。。。
#### 1022 修改获取用户列表
>- 获取用户列表中service层,currentpage改成从前端传进来的实时currentpage值。
#### 1026 解决0921评论列表中bug关于toJSON()的问题
>- array.push接受字符串。但是这个comment是一个查询出来的实例对象，需要转换，用sequlize中写在对象上的tojson()方法：把查询实例转换成字符串原值。
#### 1104 logout接口&&session的配置
>- 前端需要完成logout接口，并完成session的配置
#### 1110 上传文件完善
>- 保证例如user中头像的路径的输入，article中缩略图路径的输入。







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