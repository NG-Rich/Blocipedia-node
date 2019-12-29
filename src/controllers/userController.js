const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const Authorizer = require("../policies/user");

module.exports = {
  signUp(req, res, next) {
    const authorized = new Authorizer(req.user).new();

    if(!authorized) {
      res.render("users/sign_up");
    }else {
      req.flash("notice", "You're already signed up!");
      res.redirect("/");
    }
  },
  create(req, res, next) {
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if(err) {
        req.flash("error", err);
        res.redirect("/users/sign_up");
      }else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully sign in!");
          res.redirect("/");

          const msg = {
            to: `${newUser.email}`,
            from: "donotreply@example.com",
            subject: "Account Creation",
            text: "Welcome to Blocipedia!",
            html: "<strong>Welcome!</strong>"
          };
          sgMail.send(msg);
        })
      }
    });
  },
  signInForm(req, res, next) {
    res.render("users/sign_in");
  },
  signIn(req, res, next) {
    passport.authenticate("local")(req, res, () => {
      if(!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      }else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },
  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  upgrade(req, res, next) {
      const authorized = new Authorizer(req.user)._isAdmin();

      if(!authorized) {
        res.render("users/upgrade");
      }else {
        req.flash("notice", "No need to upgrade, you're an admin!");
        res.redirect("/");
      }
  },
  upgradeSuccess(req, res, next) {
    userQueries.upgradeUser(req, (err, user) => {
      if(err) {
        req.flash("error", err);
        res.redirect("/users/upgrade");
      }else {
        req.flash("notice", "You've upgraded your account!");
        res.redirect("/");
      }
    });
  },
  downgrade(req, res, next) {
    const authorized = new Authorizer(req.user)._isAdmin();

    if(!authorized) {
      res.render("users/downgrade");
    }else {
      req.flash("notice", "No need to downgrade, you're an admin!");
      res.redirect("/");
    }
  },
  downgradeSuccess(req, res, next) {
    userQueries.downgradeUser(req, (err, user) => {
      if(err) {
        req.flash("error", err);
        res.redirect("/users/downgrade");
      }else {
        req.flash("notice", "You've downgraded your account, but maybe we'll see you again!");
        res.redirect("/");
      }
    });
    wikiQueries.downgradeWiki(req.user.id);
  }
}
