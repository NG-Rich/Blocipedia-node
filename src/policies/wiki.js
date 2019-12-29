const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  edit() {
    return this.new();
  }

  privateWiki() {
    return this._isPremium() || this._isAdmin();
  }

}
