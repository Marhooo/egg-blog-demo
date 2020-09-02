# eggserver
*Alt+M快捷键Markdown*
#### 0901 login和register完成
>- findById方法注意sequelize的版本
>- ```replace(/-/g, "")```用于格式化日期，如2016-1-1格式化为201611,```/g ```代表全局，所有的```- ```都替换
#### 0902 获取当前用户信息&&获取用户信息完成
>- 修改了getAccessToken ()中```return bearerToken && bearerToken.replace("Bearer ", "")```这段代码,在Bearer后面加了一个*空格*,方便Postman加入Bearer Token,这样在前端vue代码中也需要修改了.

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