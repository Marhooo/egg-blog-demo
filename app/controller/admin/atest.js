const Controller = require('../../core/base_controller');

class AtestController extends Controller{
    //测试接口
    async testapi(){
        this.ctx.body = {
            "输出" : "HELLO WORLD!!!"
        }
    }
}

module.exports = AtestController