const Service = require('egg').Service;

class articleService extends Service {
  // 增加修改文章
  async saveOrUpArticle(options) {
    const transaction = await this.ctx.model.transaction();
    try {
      for (let i = 0; i < options.article_label.length; i++) {
        let res = await this.ctx.model.ArticleLabel.findOne({
          where: {
            label_name: options.article_label[i],
          },
        });
        await this.ctx.model.ArticleLabel.update(
          {
            add_num: res.add_num + 1,
          },
          {
            where: {
              id: res.id,
            },
            transaction,
          }
        );
      }
      options.article_label = options.article_label.join(',');
      const result = await this.ctx.model.Article.upsert(options, { transaction });
      if (result) {
        await transaction.commit();
        this.ctx.body = {
          code: 200,
          message: '文章添加成功',
        };
      } else {
        await transaction.commit();
        this.ctx.body = {
          code: 200,
          message: '文章更新成功',
        };
      }
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      this.ctx.helper.error(200, 10404, '文章添加更新失败');
    }
  }

  // 查询文章列表
  async articleList(options) {
    try {
      const { currentPage, pageSize } = options;
      const result = await this.ctx.model.Article.findAndCountAll({
        limit: parseInt(pageSize),
        offset: parseInt(pageSize) * (parseInt(currentPage) - 1),
        order: [['created_at', 'DESC']], //按时间顺序返回，DESC按最新
      });
      //灰色部分代码有问题的根本原因是使用 promise 或 async 函数作为 forEach() 等类似方法的 callback 参数，导致队列接不到回执。
      // result.rows.forEach(async element => {
      //   const resUser = await this.ctx.model.SystemUser.findByPk(element.author)
      //   element.author = resUser.name
      // });
      for (let i = 0; i < result.rows.length; i++) {
        const resUser = await this.ctx.model.SystemUser.findByPk(result.rows[i].author);
        result.rows[i].dataValues.author_name = resUser.name;
      }
      this.ctx.body = {
        code: 200,
        data: result,
      };
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '查询失败');
    }
  }

  //查询具体标签文章列表
  async getArticleInLabel(options) {
    const Op = this.app.Sequelize.Op;
    try {
      const { currentPage, pageSize, article_label } = options;
      const result = await this.ctx.model.Article.findAndCountAll({
        limit: parseInt(pageSize),
        offset: parseInt(pageSize) * (parseInt(currentPage) - 1),
        where: {
          article_label: {
            [Op.like]: `%${article_label}%`,
          },
        },
        order: [['read_num', 'DESC']]
      });
      //这里查出来的已经有所有的列表count数量了
      this.ctx.body = {
        code: 200,
        data: result,
      };
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '查询失败');
    }
  }

  //查找你的文章
  async getArticleYouself(options) {
    try {
      const { currentPage, pageSize, id } = options;
      const result = await this.ctx.model.Article.findAndCountAll({
        limit: parseInt(pageSize),
        offset: parseInt(pageSize) * (parseInt(currentPage) - 1),
        where: {
          author: id
        },
        order: [['created_at', 'DESC']]      
      })
      this.ctx.body = {
        code: 200,
        data: result,
      };
    }catch(err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '查询失败');      
    }
  }

  //查询热门文章
  async getArticleHot(options) {
    try {
      const { currentPage, pageSize } = options;
      const result = await this.ctx.model.Article.findAndCountAll({
        limit: parseInt(pageSize),
        offset: parseInt(pageSize) * (parseInt(currentPage) - 1),
        order: [['read_num', 'DESC']],
      });
      this.ctx.body = {
        code: 200,
        data: result,
      };
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '查询失败');
    }
  }

  //搜你感兴趣的文章
  async getArticleInterested(options) {
    const Op = this.app.Sequelize.Op;
    try {
      const { currentPage, pageSize, search } = options;
      const result = await this.ctx.model.Article.findAndCountAll({
        limit: parseInt(pageSize),
        offset: parseInt(pageSize) * (parseInt(currentPage) - 1),
        where: {
          [Op.or]: [
            {
              article_label: {
                [Op.like]: `%${search}%`,
              },
            },
            { content_html: { [Op.like]: `%${search}%` } },
          ],
        },
        order: [['read_num', 'DESC']],
      });
      this.ctx.body = {
        code: 200,
        data: result,
      };
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '查询失败');
    }
  }

  //文章点赞或取消点赞
  async adcArticleLike(options) {
    const transaction = await this.ctx.model.transaction();
    const Op = this.app.Sequelize.Op;
    try {
      const { article_id, user_id } = options;
      const resart = await this.ctx.model.Article.findByPk(article_id);
      const result = await this.ctx.model.ArticleUserLikes.findOne({
        where: {
          [Op.and]: [{ article_id: article_id }, { user_id: user_id }],
        },
      });
      if (result) {
        await this.ctx.model.ArticleUserLikes.destroy({
          where: {
            id: result.id,
          },
          transaction,
        });
        const num = resart.praise_num - 1;
        await this.ctx.model.Article.update(
          {
            praise_num: num,
          },
          {
            where: {
              id: article_id,
            },
            transaction,
          }
        );
        await transaction.commit();
        this.ctx.body = {
          code: 200,
          message: '取消点赞成功',
        };
      } else {
        await this.ctx.model.ArticleUserLikes.create(options, { transaction });
        await this.ctx.model.Article.update(
          {
            praise_num: (resart.praise_num += 1),
          },
          {
            where: {
              id: article_id,
            },
            transaction,
          }
        );
        await transaction.commit();
        this.ctx.body = {
          code: 200,
          message: '点赞成功',
        };
      }
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      this.ctx.helper.error(200, 10404, '点赞失败');
    }
  }

  //获取点赞相关用户信息
  async getLikeUser(options) {
    try {
      //这里是inner join (取A,B的交集)，还有一种是LEFT JOIN/LEFT OUTER JOIN相同，(取A全集，B中与A的交集)
      // const result = await this.ctx.model.ArticleUserLikes.findAll({
      //   include: {
      //     model: this.app.model.SystemUser,
      //     where: {
      //       user_id: options.id
      //     }
      //   }
      // })
      const result = await this.app.model.query(
        'SELECT `articleuserlikes`.`user_id`, `articleuserlikes`.`id`, `system_users`.`name`, `system_users`.`avatar` FROM articleuserlikes INNER JOIN system_users ON `articleuserlikes`.`user_id` = `system_users`.`id` AND `articleuserlikes`.`article_id` = :article_id',
        {
          replacements: { article_id: options.id },
          type: this.app.Sequelize.QueryTypes.SELECT,
        }
      );
      this.ctx.body = {
        code: 200,
        data: result,
      };
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '查询失败!');
    }
  }

  //文章回显
  async getArticle(aId) {
    try {
      const articleresult = await this.ctx.model.Article.findByPk(aId);
      if (articleresult) {
        articleresult.read_num += 1;
        await this.ctx.model.Article.update(
          {
            read_num: articleresult.read_num,
          },
          {
            where: {
              id: aId,
            },
          }
        );
        return articleresult;
      } else {
        return articleresult;
      }
    } catch (err) {
      console.log(err);
    }
  }

  //删除文章
  async delArticle(options) {
    try {
      const result = await this.ctx.model.Article.destroy({
        where: {
          id: options.id,
        },
      });
      if (result) {
        this.ctx.body = {
          code: 200,
          message: '文章删除成功!',
        };
      } else {
        this.ctx.helper.error(200, 10204, '文章删除失败!');
      }
    } catch (err) {
      console.log(err);
      this.ctx.helper.error(200, 10404, '文章删除失败!');
    }
  }
}

module.exports = articleService;
