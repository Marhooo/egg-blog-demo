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
      //console.log(result);
      if (result == null && codeInfo) {
        options.verify_code = parseInt(options.imei.slice(-4)) * 2 + 5678;
        await this.ctx.model.GameMonitor.update(options, {
          where: {
            pay_order: codeInfo.id,
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
}
module.exports = GameMonitorService;
