const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");
const markdown = require("markdown").markdown;
const collabQueries = require('../db/queries.collaborators.js');

module.exports = {
  index(req, res, next) {
    // MAKE IT DISPLAY FOR COLLABORATORS
    // figure out why wikis dont display if youre a collab
    wikiQueries.getAllWikis((err, wikis) => {
      if(err) {
        res.redirect(500, "static/index");
      }else {
        collabQueries.collabWikis(req, (err, collaborator) => {
          if(err) {
            res.redirect(500, "static/index");
          }else {
            //console.log(collaborator);
            res.render("wikis/index", {wikis, collaborator});
          }
        });
        //res.render("wikis/index", {wikis});
      }
    });
  },
  new(req, res, next) {
    res.render("wikis/new");
  },
  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();

    if(authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private,
        userId: req.user.id
      };

      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if(err) {
          res.redirect(500, "/wikis/new");
        }else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    }else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },
  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, "/");
      }else {
        const authorized = new Authorizer(req.user, wiki).privateWiki();
        wiki.body = markdown.toHTML(wiki.body);

        if(wiki.private == false) {
          res.render("wikis/show", {wiki});
        }else if(wiki.private == true && authorized) {
          res.render("wikis/show", {wiki});
        }else {
          req.flash("notice", "You are cannot view this private wiki.");
          res.redirect("/wikis");
        }
      }
    });
  },
  destroy(req, res, next) {
    wikiQueries.deleteWiki(req, (err, wiki) => {
      if(err) {
        res.redirect(`/wikis/${req.params.id}`);
      }else {
        res.redirect(303, "/wikis");
      }
    });
  },
  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, "/");
      }else {
        const authorized = new Authorizer(req.user, wiki).edit();

        if(authorized) {
          res.render("wikis/edit", {wiki});
        }else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect("/wikis");
        }
      }
    });
  },
  update(req, res, next) {
    wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      }else {
        res.redirect(`/wikis/${wiki.id}`);
      }
    });
  }
}
