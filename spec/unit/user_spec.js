const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {

  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  }); // End of beforeEach

  describe("#create()", () => {

    it("should create a User object with a name, a valid email and password", (done) => {
      User.create({
        name: "Jon Doe",
        email: "user@example.com",
        password: "123456"
      })
      .then((user) => {
        expect(user.name).toBe("Jon Doe");
        expect(user.email).toBe("user@example.com");
        expect(user.id).toBe(1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a User object without valid entries", (done) => {
      User.create({
        name: "Jon Doe",
        email: "Jone-Doe",
        password: "123456"
      })
      .then((user) => {
        // Code skips because fails validation. Expect in catch
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation error: must be a valid email");
        done();
      });
    });

    it("should not create a User with an email already taken", (done) => {
      User.create({
        name: "Jon Doe",
        email: "user@example.com",
        password: "123456"
      })
      .then((user) => {
        User.create({
          name: "Jon Doe",
          email: "user@example.com",
          password: "123456"
        })
        .then((user) => {
          // Code block skips
          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Validation error");
          done();
        })
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

});
