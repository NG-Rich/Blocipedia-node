const wikiQueries = require("../db/queries.wikis.js");
const collabQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/user");

module.exports = {
  show(req, res, next) {
    // ADD AUTHORIZE IN THIS LATER
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null) {
        req.flash("notice", "Ran into an error!");
        res.redirect(`/wikis/${wiki.id}`);
      }else {
        collabQueries.getCollaborators(req.params.id, (err, collaborators) => {
          if(err || wiki == null) {
            req.flash("notice", "Ran into an error!");
            res.redirect(`/wikis/${wiki.id}`);
          }else {
            res.render("collaborators/show", {wiki, collaborators});
          }
        });
      }
    });
  },
  add(req, res, next) {
    collabQueries.addUser(req, (err, collaborator) => {
      if(err) {
        req.flash("notice", err);
      }

      res.redirect(req.headers.referer);
    });
  },
  remove(req, res, next) {
    collabQueries.removeUser(req, (err, collaborator) => {
      if(err) {
        req.flash("notice", err);
      }

      res.redirect(req.headers.referer);
    });
  }
}
