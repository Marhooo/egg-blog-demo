const Controller = require('../../core/base_controller');

class RegisterController extends Controller{
    //用户注册
    async userRegister(){
        let regData = this.ctx.request.body
        if(!regData.name){
            regData.name = regData.username
        }
        let results = await this.service.admin.register.userRegister(regData)
        this.ctx.body = results
    }
}

module.exports = RegisterController