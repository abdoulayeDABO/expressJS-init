'use strict';
const {
  Model
} = require('sequelize');

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
  User.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        get() {
          return this.getDataValue('id')
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        get() {
          return this.getDataValue('email')
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue('name');
          return rawValue ? rawValue.toUpperCase() : null;
        }
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue('first_name');
          return rawValue ? rawValue.toUpperCase() : null;
        }
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue('last_name');
          return rawValue ? rawValue.toUpperCase() : null;
        }
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
      },
      reset_password_token: {
        type: DataTypes.STRING,
        unique: true,
      },
      reset_password_expires: {
        type: DataTypes.DATE,
      },
      validate_account_token: {
        type: DataTypes.STRING,
        unique: true,
      },
      validate_account_expires: {
        type: DataTypes.DATE,
      },
      validated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
  }, 
  {
    timestamps: false,
    sequelize,
    modelName: 'User',
  });
  return User;
};