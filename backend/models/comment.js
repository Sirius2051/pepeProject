'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: "userID" })
      Comment.belongsTo(models.Post, { foreignKey: "postID" })
      // define association here
    }
  }
  Comment.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    postID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};