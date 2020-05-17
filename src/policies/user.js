const ApplicationPolicy = require("./application");

module.exports = class UserPolicy extends ApplicationPolicy {
  collaborator() {
    return (this._isOwner() || this._isAdmin());
  }
}
