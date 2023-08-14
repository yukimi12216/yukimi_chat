"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      employee_id: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      employee_status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
