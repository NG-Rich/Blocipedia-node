const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;

module.exports = {
  addUser(req, callback) {
    return User.findOne({where: {username: req.body.collaborator}})
    .then((user) => {
      if(!user) {
        callback("User not found!");
      }else if (user.id == req.user.id) {
        callback("You cannot add yourself!");
      }else {
        Collaborator.findOne({
          where: {
            userId: user.id,
            wikiId: req.params.id
          }
        })
        .then((collaborator) => {
          if(collaborator) {
            return callback("User is already a collaborator in this wiki!");
          }

          return Collaborator.create({
            userId: user.id,
            wikiId: req.params.id
          })
          .then((collaborator) => {
            req.flash("notice", "User added!");
            callback(null, collaborator);
          })
          .catch((err) => {
            callback(err);
          });
        })
        .catch((err) => {
          callback(err);
        });
      }
    })
    .catch((err) => {
      callback(err);
    })
  },
  getCollaborators(id, callback) {
    return Wiki.findByPk(id, {
      include: [
        {model: Collaborator, as: "collaborators", include: [
          {model: User}
        ]}
      ]
    })
    .then((wiki) => {
      callback(null, wiki.collaborators);
    })
    .catch((err) => {
      callback(err);
    });
  },
  removeUser(req, callback) {
    return Collaborator.findOne({where: {
      userId: req.body.collaborator,
      wikiId: req.params.id
    }})
    .then((collaborator) => {
      collaborator.destroy()
      .then((deletedUserCount) => {
        callback(null, deletedUserCount);
      })
      .catch((err) => {
        callback(err);
      })
    })
    .catch((err) => {
      callback(err);
    })
  },
  collabWikis(req, callback) {
    return Collaborator.findAll({include: [{model: Wiki}]}, {where: {userId: req.user.id}})
    .then((collaborator) => {
      callback(null, collaborator);
    })
    .catch((err) => {
      callback(err);
    })
  }
}
