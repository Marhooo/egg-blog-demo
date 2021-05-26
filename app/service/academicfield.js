const Service = require('egg').Service;

class AcademicFieldService extends Service {
  // 增加修改学术领域块
  async saveOrUpAcademic(data) {
    try {
      const result = await this.ctx.model.AcademicField.upsert(data);
      //创建为true，更新为false
      if (result) {
        this.ctx.body = {
          code: 200,
          message: '学术领域块添加成功',
        };
      } else {
        this.ctx.body = {
          code: 200,
          message: '学术领域块更新成功',
        };
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '添加更新失败');
    }
  }

  // 查找学术领域
  async getAcademicField(options) {
    try {
      const { academic_name } = options;
      let result;
      if (academic_name) {
        result = await this.ctx.model.AcademicField.findOne({
          where: {
            academic_name: academic_name,
          },
        });
      } else {
        result = await this.ctx.model.AcademicField.findAll();
      }
      if (result) {
        this.ctx.body = result;
      } else {
        this.ctx.helper.error(200, 10204, '未查询到相关数据');
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '查询失败');
    }
  }
}

module.exports = AcademicFieldService;
