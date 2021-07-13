const Controller = require('../core/base_controller');

class GameMonitorController extends Controller {
  //
  async addGameRawData() {
    try {
      this.ctx.validate({ imei: { type: 'string', min: 6, max: 35, format: /^\w+[\d][\d][\d][\d]$/, allowEmpty: false} }, this.ctx.request.body);
      const options = this.ctx.request.body;
      await this.ctx.service.gamemonitor.addGameRawData(options);
    } catch(err) {
      err.warn = '参数错误!'
      this.ctx.helper.error(200, 10030, err);  
    }
  }

  //文件下载
  async downloadGameFile() {
    try {
      const options = this.ctx.request.query;
      const nowtime = Math.round(new Date().getTime() / 1000);
      if (nowtime < options.querytime) {
        await this.ctx.helper.download(
          'app/public/download/失落大陆辅助V5.apk',
          '失落大陆辅助V5.apk'
        );
      } else {
        this.ctx.helper.error(200, 10030, '请求链接失效，请返回小程序重新获取下载链接!');
      }
    } catch (err) {
      this.ctx.helper.error(200, 10404, '未知错误!请联系作者!');
    }
  }

  //远程失落大陆脚本锁
  async lostVerify() {
    const options = this.ctx.request.query;
    await this.ctx.service.gamemonitor.lostVerify(options)
  }
}

module.exports = GameMonitorController;
