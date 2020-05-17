const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  privateWiki() {
    return this.record &&
    (this._isPremium() || this._isAdmin() || this.new());
  }

}
