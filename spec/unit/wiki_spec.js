const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("WIKI", () => {

  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        username: "Starman",
        email: "starman@tesla.com",
        password: "123456"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "Doggopedia",
          body: "All about dogs!",
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
      })
    });
  }); // End of beforeEach

  describe("#create()", () => {

    it("should create and store a wiki object into the database", (done) => {

      Wiki.create({
        title: "Catpedia",
        body: "All about cats!",
        userId: this.user.id
      })
      .then((wiki) => {
        expect(wiki.title).toBe("Catpedia");
        expect(wiki.body).toBe("All about cats!");
        done();
      });

    });

  });

  describe("#setUser()", () => {

    it("should associate a wiki and a user together", (done) => {

      User.create({
        username: "Userman",
        email: "user@example.com",
        password: "123456"
      })
      .then((newUser) => {
        expect(this.wiki.userId).toBe(this.user.id);
        this.wiki.setUser(newUser)
        .then((wiki) => {
          expect(this.wiki.userId).toBe(newUser.id);
          done();
        });
      });

    });

  });

});
