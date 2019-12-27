const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

function authorizeUser(role, done) {
  User.create({
    username: `${role}`,
    email: `${role}@example.com`,
    password: "123456",
    role: role
  })
  .then((user) => {
    request.get({
      url: "http://localhost:3000/auth/fake",
      form: {
        role: user.role,
        userId: user.id,
        email: user.email
      }
    }, (err, res, body) => {
      done();
    });
  });
}

describe("routes : wikis", () => {

  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        username: "Starman",
        email: "starman@tesla.com",
        password: "123456",
        role: "standard"
      })
      .then((res) => {
        this.user = res;

        Wiki.create({
          title: "Doggopedia",
          body: "All dog related info!",
          private: false,
          userId: this.user.id
        })
        .then((res) => {
          this.wiki = res;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      })
    });
  }); // End of beforeEach

  describe("admin user performing CRUD actions for Wiki", () => {

    beforeEach((done) => {
      authorizeUser("admin", done);
    }); // End of beforeEach

    describe("GET /wikis", () => {

      it("should return status code 200 and all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("All Wikis");
          expect(body).toContain("Doggopedia");
          done();
        });
      });

    });

    describe("GET /wikis/new", () => {

      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });

      });

    });

    describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Catpedia",
          body: "Here we talk about cats!",
          private: this.private
        }
      };

      it("should create a new public wiki and redirect", (done) => {
        options.form.private = false;

        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Catpedia"}})
          .then((wiki) => {
            expect(res.statusCode).toBe(303);
            expect(wiki.title).toBe("Catpedia");
            expect(wiki.body).toBe("Here we talk about cats!");
            expect(wiki.private).toBe(false);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          })
        });
      });

      it("should create a new private wiki and redirect", (done) => {
        options.form.private = true;

        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Catpedia"}})
          .then((wiki) => {
            expect(res.statusCode).toBe(303);
            expect(wiki.title).toBe("Catpedia");
            expect(wiki.body).toBe("Here we talk about cats!");
            expect(wiki.private).toBe(true);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });


      });

    });

    describe("GET /wikis/:id", () => {

      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Doggopedia");
          done();
        });
      });

    });

    describe("POST /wikis/:id/destroy", () => {

      it("should delete the wiki with the associated ID", (done) => {
        Wiki.findAll()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;

          expect(wikiCountBeforeDelete).toBe(1);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            })
          });
        });
      });

    });

    describe("GET /wikis/:id/edit", () => {

      it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Doggopedia");
          done();
        });
      });

    });

    describe("POST /wikis/:id/update", () => {

      it("should update the wiki with the given values", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Doggopedia",
            body: "There's a lot of them!"
          }
        };

        request.post(options, (err, res, body) => {
          expect(err).toBeNull();

          Wiki.findOne({where: {id: this.wiki.id}})
          .then((wiki) => {
            expect(wiki.body).toBe("There's a lot of them!");
            done();
          });
        });
      });

    });

  }); // End of admin context

  describe("premium user performing CRUD actions for Wiki", () => {

      beforeEach((done) => {
        authorizeUser("premium", done);
      });

      describe("GET /wikis", () => {

        it("should return status code 200 and all wikis", (done) => {
          request.get(base, (err, res, body) => {
            expect(res.statusCode).toBe(200);
            expect(err).toBeNull();
            expect(body).toContain("All Wikis");
            expect(body).toContain("Doggopedia");
            done();
          });
        });

      });

      describe("GET /wikis/new", () => {

        it("should render a new wiki form", (done) => {
          request.get(`${base}new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Wiki");
            done();
          });

        });

      });

      describe("POST /wikis/create", () => {
        const options = {
          url: `${base}create`,
          form: {
            title: "Catpedia",
            body: "Here we talk about cats!"
          }
        };

        it("should create a new wiki and redirect", (done) => {
          request.post(options, (err, res, body) => {
            Wiki.findOne({where: {title: "Catpedia"}})
            .then((wiki) => {
              expect(res.statusCode).toBe(303);
              expect(wiki.title).toBe("Catpedia");
              expect(wiki.body).toBe("Here we talk about cats!");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            })
          });
        });

      });

      describe("GET /wikis/:id", () => {

        it("should render a view with the selected wiki", (done) => {
          request.get(`${base}${this.wiki.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Doggopedia");
            done();
          });
        });

      });

      describe("POST /wikis/:id/destroy", () => {

        it("should not delete the wiki with the associated ID", (done) => {
          Wiki.findAll()
          .then((wikis) => {
            const wikiCountBeforeDelete = wikis.length;

            expect(wikiCountBeforeDelete).toBe(1);

            request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
              Wiki.findAll()
              .then((wikis) => {
                expect(err).toBeNull();
                expect(wikis.length).toBe(wikiCountBeforeDelete);
                done();
              })
            });
          });
        });

      });

      describe("GET /wikis/:id/edit", () => {

        it("should render a view with an edit wiki form", (done) => {
          request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Edit Wiki");
            expect(body).toContain("Doggopedia");
            done();
          });
        });

      });

      describe("POST /wikis/:id/update", () => {

        it("should update the wiki with the given values", (done) => {
          const options = {
            url: `${base}${this.wiki.id}/update`,
            form: {
              title: "Doggopedia",
              body: "There's a lot of them!"
            }
          };

          request.post(options, (err, res, body) => {
            expect(err).toBeNull();

            Wiki.findOne({where: {id: this.wiki.id}})
            .then((wiki) => {
              expect(wiki.body).toBe("There's a lot of them!");
              done();
            });
          });
        });

      });

  }); // End of premium user context

  describe("standard user performing CRUD actions for Wiki", () => {

    beforeEach((done) => {
      authorizeUser("standard", done);
    });

    describe("GET /wikis", () => {

      it("should return status code 200 and all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("All Wikis");
          expect(body).toContain("Doggopedia");
          done();
        });
      });

    });

    describe("GET /wikis/new", () => {

      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });

      });

    });

    describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Catpedia",
          body: "Here we talk about cats!"
        }
      };

      it("should create a new wiki and redirect", (done) => {
        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Catpedia"}})
          .then((wiki) => {
            expect(res.statusCode).toBe(303);
            expect(wiki.title).toBe("Catpedia");
            expect(wiki.body).toBe("Here we talk about cats!");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          })
        });
      });

    });

    describe("GET /wikis/:id", () => {

      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Doggopedia");
          done();
        });
      });

    });

    describe("POST /wikis/:id/destroy", () => {

      it("should not delete the wiki with the associated ID", (done) => {
        Wiki.findAll()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;

          expect(wikiCountBeforeDelete).toBe(1);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete);
              done();
            })
          });
        });
      });

    });

    describe("GET /wikis/:id/edit", () => {

      it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Doggopedia");
          done();
        });
      });

    });

    describe("POST /wikis/:id/update", () => {

      it("should update the wiki with the given values", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Doggopedia",
            body: "There's a lot of them!"
          }
        };

        request.post(options, (err, res, body) => {
          expect(err).toBeNull();

          Wiki.findOne({where: {id: this.wiki.id}})
          .then((wiki) => {
            expect(wiki.body).toBe("There's a lot of them!");
            done();
          });
        });
      });

    });

  }); // End of standard user context

});
