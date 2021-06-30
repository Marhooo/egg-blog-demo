const Service = require('egg').Service;

class GameMonitorService extends Service {
  // 修改gamemonitor数据，初创数据在payment中完成
  async addGameRawData(options) {
    const Op = this.app.Sequelize.Op;
    try {
      options.wechat_name = this.ctx.session.user.name
      options.has_besend = true;
      const result = await this.ctx.model.Order.findAll({
        where: {
          [Op.and]: [
            { user_id: this.ctx.session.user.id },
            { pay_for: '1' },
            { pay_status: '1' },
            //{ pay_status: { [Op.or]: ['0', '1'] } },
          ],
        },
      });
      const codeInfo = await this.ctx.model.GameMonitor.findOne({
        where: {
          [Op.and]: [{ user_id: this.ctx.session.user.id }, { has_besend: false }],
        },
      });
      if (result.length === 0 && codeInfo) {
        options.verify_code = parseInt(options.imei.slice(-4)) * 2 + 5678;
        await this.ctx.model.GameMonitor.update(options, {
          where: {
            pay_order: codeInfo.pay_order,
          },
        });
        this.ctx.body = {
          code: 200,
          data: {
            vcode: options.verify_code,
          },
        };
      } else {
        this.ctx.helper.error(200, 10204, '您暂未购买辅助,请先购买!');
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '未知错误!请联系作者!');
    }
  }

  //远程失落大陆脚本锁
  async lostVerify(options) {
    try {
      const {verify_code} = options
      const result = await this.ctx.model.GameMonitor.findOne({
        where: {
          verify_code: verify_code
        }
      })
      if (result) {
        this.ctx.body = {
          code: 200,
          data: {
            canload: result.can_load
          }
        }
      } else {
        this.ctx.helper.error(200, 10204, '查询失败!请联系作者!');        
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '未知错误!请联系作者!');      
    }
  }
}
module.exports = GameMonitorService;
