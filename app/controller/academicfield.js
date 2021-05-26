const Controller = require('../core/base_controller');

class AcademicFieldController extends Controller {
  // 创建或更新学术领域块
  async addAcademicField() {
    const academicData = this.ctx.request.body;
    await this.ctx.service.academicfield.saveOrUpAcademic(academicData); //这个api是如果传参时id主键存在就更新数据。
  }

  // 查找学术领域
  async getAcademicField() {
    const options = this.ctx.request.query;
    await this.ctx.service.academicfield.getAcademicField(options);
    //把this.ctx.body写在service层，更优雅的去处理错误
  }
}

module.exports = AcademicFieldController;
