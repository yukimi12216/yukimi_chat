"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserMessages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserMessages.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      UserMessages.belongsTo(models.Room, {
        foreignKey: "room_id",
      });
    }
  }
  UserMessages.init(
    {
      message: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserMessages",
    }
  );
  return UserMessages;
};
