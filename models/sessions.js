  'use strict';
  const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class Session extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
      }
    }
    Session.init({
        sid: {
            type: DataTypes.STRING,
            primaryKey: true,
          },
        userId: DataTypes.STRING,
        expires: DataTypes.DATE,
        data: DataTypes.TEXT,
        },
        {
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: 'Session', // We need to choose the model name
            // timestamps: false,
        }
        );
    return Session;
  };