const uuidv1 = require("uuid/v1")

function generateUUID () {
  return uuidv1().replace(/-/g, "")
}

function defineModel (app, name, attributes) {
  const { UUID } = app.Sequelize

  const attrs = {}
  for (const key in attributes) {
    const value = attributes[key]
    if (typeof value === "object" && value.type) {
      value.allowNull = value.allowNull && false
      attrs[key] = value
    } else {
      attrs[key] = {
        type: value,
        allowNull: true,
      }
    }
  }

  attrs.id = {
    type: UUID,
    primaryKey: true,
    defaultValue: () => {
      return generateUUID()
    },
  }

  // attrs.createdAt = {
  //   type: app.Sequelize.DATE, 
  //   field: 'created_at',
  // }

  // attrs.updatedAt = {
  //   type: app.Sequelize.DATE, 
  //   field: 'updated_at',
  // }  

  return app.model.define(name, attrs, {
    // 如果需要sequelize帮你维护createdAt,updatedAt和deletedAt必须先启用timestamps功能
    timestamps: true,
    createdAt : 'created_at',
    updatedAt : 'updated_at',   
    version: true,
    freezeTableName: true, // Model 对应的表名将与model名相同,不会变为复数
  })
}

module.exports = { defineModel }