'use strict';
module.exports = (sequelize, DataTypes) => {
  const Collaborator = sequelize.define('Collaborator', {
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Wikis",
        key: "id",
        as: "wikiId"
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
        as: "userId"
      }
    }
  }, {});
  Collaborator.associate = function(models) {
    // associations can be defined here
    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });
    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Collaborator.addScope("collaboratorsFor", (wikiId) => {
      return {
        include: [
          {
            model: models.User
          }
        ],
        where: {wikiId: wikiId},
        order: [["createdAt"], "ASC"]
      };
    }, {
      override: true
    });
    Collaborator.addScope("collaboratorsFor", (userId) => {
      return {
        include: [
          {
            model: models.Wiki
          }
        ],
        where: {userId: userId},
        order: [["createdAt", "ASC"]]
      };
    }, {
      override: true
    });
  };
  return Collaborator;
};
