"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRooms.belongsTo(models.Room, {
        foreignKey: "room_id",
      });
      UserRooms.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  UserRooms.init(
    {
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserRooms",
    }
  );
  return UserRooms;
};
