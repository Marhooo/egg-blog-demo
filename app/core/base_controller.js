const { Controller } = require('egg');
class BaseController extends Controller{
    get user() {
        return this.ctx.session.user;
    }
}

module.exports = BaseController;