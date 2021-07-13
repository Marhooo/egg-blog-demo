const chalk = require("chalk")
const { cryptoMd5 } = require("./app/extend/helper")
const path = require('path')
class AppBootHook {
  constructor (app) {
    this.app = app
  }

  async didLoad() {
    // 引入validate目录，并注入app实例
    const directory = path.join(this.app.config.baseDir, 'app/validate');
    this.app.loader.loadToApp(directory, 'validate');
  }   

  async willReady () {
    const keys = this.app.config.keys
    let rid
    // force 为 true 时,系统每次启动都会删除之前所有数据表,重新建表(类似删库)
    // force 为 false 时,系统缺失数据表的时候会自动创建, 比如在/app/model/ 下新建一个模型时,系统运行会自动创建这个模型的数据表
    await this.app.model.sync({ force: false }).then(async res => {
      console.log(chalk.green(`
\\\\ \\\\ \\\\ \\\\ \\\\ \\\\ \\\\ \\\\ || || || || || || // // // // // // // //
\\\\ \\\\ \\\\ \\\\ \\\\ \\\\ \\\\        _ooOoo_          // // // // // // //
\\\\ \\\\ \\\\ \\\\ \\\\ \\\\          o8888888o            // // // // // //
\\\\ \\\\ \\\\ \\\\ \\\\             88" . "88               // // // // //
\\\\ \\\\ \\\\ \\\\                (| -_- |)                  // // // //
\\\\ \\\\ \\\\                   O\\  =  /O                     // // //
\\\\ \\\\                   ____/\`---'\\____                     // //
\\\\                    .'  \\\\|     |//  \`.                      //
==                   /  \\\\|||  :  |||//  \\                     ==
==                  /  _||||| -:- |||||-  \\                    ==
==                  |   | \\\\\\  -  /// |   |                    ==
==                  | \\_|  ''\\---/''  |   |                    ==
==                  \\  .-\\__  \`-\`  ___/-. /                    ==
==                ___\`. .'  /--.--\\  \`. . ___                  ==
==              ."" '<  \`.___\\_<|>_/___.'  >'"".               ==
==            | | :  \`- \\\`.;\`\\ _ /\`;.\`/ - \` : | |              \\\\
//            \\  \\ \`-.   \\_ __\\ /__ _/   .-\` /  /              \\\\
//      ========\`-.____\`-.___\\_____/___.-\`____.-'========      \\\\
//                           \`=---='                           \\\\
// //   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  \\\\ \\\\
// // //      佛祖保佑      永无BUG      永不修改        \\\\ \\\\ \\\\
// // // // // // || || || || || || || || || || \\\\ \\\\ \\\\ \\\\ \\\\ \\\\
            `))

      await res.SystemRole.findOne({
        where: {
          name: "超级管理员", // 查询条件
        },
      }).then(async result => {
        console.log(chalk.green("========== 系统表创建完成 =========="))
        console.log(chalk.green("系统最高权限角色检查..."))
        if (!result) {
          await res.SystemRole.create({
            name: "超级管理员",
            describe: "系统最高权限",
            status: true,
          }).then(async ok => {
            rid = ok.id
            console.log(chalk.green("系统默认最高权限角色生成成功:角色名 [") + chalk.blue("超级管理员") + chalk.green("]"))            
            await res.SystemRolePermission.create({
              role_id: ok.id
            }).then(okk => {
              console.log(chalk.green("========== 系统默认最高权限角色Permission创建成功! =========="))
            }).catch(err => {
              console.log(chalk.red("========== 系统默认最高权限角色Permission检查失败 =========="))
              console.log(chalk.red(err))              
            })
          }).catch(err => {
            console.log(chalk.red("========== 系统最高权限角色检查失败 =========="))
            console.log(chalk.red(err))
          })
        } else {
          console.log(chalk.green("系统检查到已存在默认最高权限角色:角色名 [") + chalk.blue("超级管理员") + chalk.green("]"))
        }
      })


      await res.SystemUser.findOne({
        where: {
          username: "adminmaster", // 查询条件
        },
      }).then(async result => {
        console.log(chalk.green("超级管理员账号检查..."))
        if (!result) {
          const password = await cryptoMd5("adminmaster", keys)
          await res.SystemUser.create({
            username: "adminmaster",
            mobile_phone: "12345678901",
            password,
            name: "超级管理员",
            role_id: rid,
          }).then(ok => {
            console.log(chalk.green("系统默认超级管理员账号生成成功:用户名 [") + chalk.blue("adminmaster") + chalk.green("]  密码[") + chalk.blue("adminmaster") + chalk.green("]"))
            console.log(chalk.green(`
###################################
****** 欢迎使用 nodePlatform ******
****** 系统启动完成,准备就绪... ***
###################################
                    `))
          }).catch(err => {
            console.log(chalk.red("========== 管理员账号检查失败 =========="))
            console.log(chalk.red(err))
            console.log(chalk.red(`
 * _ooOoo_
 * o8888888o
 * 88" . "88
 * (| -_- |)
 *  O\\ = /O
 * ___/\`---'\\____
 * .   ' \\\\| |// \`.
 * / \\\\||| : |||// \\
 * / _||||| -:- |||||- \\
 * | | \\\\\\ - /// | |
 * | \\_| ''\\---/'' | |
 * \\ .-\\__ \`-\` ___/-. /
 * ___\`. .' /--.--\\ \`. . __
 * ."" '< \`.___\\_<|>_/___.' >'"".
 * | | : \`- \\\`.;\`\\ _ /\`;.\`/ - \` : | |
 * \\ \\ \`-. \\_ __\\ /__ _/ .-\` / /
 * ======\`-.____\`-.___\\_____/___.-\`____.-'======
 * \`=---='
 *          .............................................
 *           佛曰：bug泛滥，我已瘫痪！
 
                        `))

          })
        } else {
          console.log(chalk.green("系统检查到已存在默认超级管理员:用户名 [") + chalk.blue("adminmaster") + chalk.green("]"))
          console.log(chalk.green(`
###################################
****** 欢迎使用 nodePlatform ******
****** 系统启动完成,准备就绪... ***
###################################
                    `))
        }
      })
    }).catch(err => {
      console.log(chalk.red("========== 系统表创建失败 =========="))
      console.log(chalk.red(err))
      console.log(chalk.red(`
 * _ooOoo_
 * o8888888o
 * 88" . "88
 * (| -_- |)
 *  O\\ = /O
 * ___/\`---'\\____
 * .   ' \\\\| |// \`.
 * / \\\\||| : |||// \\
 * / _||||| -:- |||||- \\
 * | | \\\\\\ - /// | |
 * | \\_| ''\\---/'' | |
 * \\ .-\\__ \`-\` ___/-. /
 * ___\`. .' /--.--\\ \`. . __
 * ."" '< \`.___\\_<|>_/___.' >'"".
 * | | : \`- \\\`.;\`\\ _ /\`;.\`/ - \` : | |
 * \\ \\ \`-. \\_ __\\ /__ _/ .-\` / /
 * ======\`-.____\`-.___\\_____/___.-\`____.-'======
 * \`=---='
 *          .............................................
 *           佛曰：bug泛滥，我已瘫痪！

                        `))
    })
  }

}

module.exports = AppBootHook