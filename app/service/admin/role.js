const Service = require("egg").Service;

class RoleService extends Service {
  //获取角色列表
  async getRoleList() {
    const { ctx } = this;
    let result;
    await ctx.model.SystemRole.findAndCountAll()
      .then(async (res) => {
        result = res;
        for (let i = 0; i < result.rows.length; i++) {
          if (result.rows[i].name === "超级管理员") {
            result.rows[i].dataValues.disabled = true;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return result;
  }


  // 增加修改角色
  async addRole(options) {
    const { ctx } = this;
    const { id = null, name, describe, status } = options;
    let results = {};

    if (id) {
      await ctx.model.SystemRole.findById(id).then(async (res) => {
        if (res.name === "超级管理员") {
          results = {
            code: 10000,
            message: "系统最高权限不可以修改",
          };
        } else {
          await ctx.model.SystemRole.update(
            {
              name,
              describe,
              status,
            },
            {
              where: {
                id,
              },
            }
          ).then((res) => {
              if (res > 0) {
                results = {
                  code: 200,
                  message: "角色修改成功",
                };
              }
          }).catch((err) => {
              results = {
                code: 10000,
                message: err,
              };
            });
        }
      });
    } else {
      await ctx.model.SystemRole.findOne({
        where: {
          name, // 查询条件
        },
      }).then(async (result) => {
        if (!result) {
          await ctx.model.SystemRole.create(options)
            .then(async (res) => {
              await ctx.model.SystemRolePermission.create({
                role_id: res.id,
              })
                .then(() => {
                  results = {
                    code: 200,
                    message: "角色添加成功",
                  };
                })
                .catch((err) => {
                  results = {
                    code: 10000,
                    message: err,
                  };
                });
            })
            .catch((err) => {
              results = {
                code: 10000,
                message: err,
              };
            });
        } else {
          results = {
            code: 10000,
            message: "该角色已存在",
          };
        }
      });
    }
    return results;
  }



}

module.exports = RoleService;
