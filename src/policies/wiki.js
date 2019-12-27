const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  newPublic() {
    return this.user != null;
  }

  newPrivate() {
    return this.newPublic() && (this._isPremium() || this._isAdmin());
  }

  editPublic() {
    return this.newPublic() && this.record;
  }

  editPrivate() {
    return this.editPublic() && (this._isOwner() || this._isAdmin());
  }

  updatePublic() {
    return this.editPublic();
  }

  updatePrivate() {
    return this.editPrivate();
  }

  destroy() {
    return this.update();
  }
}
