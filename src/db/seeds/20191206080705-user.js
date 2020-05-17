'use strict';

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();
const hashedPassword = bcrypt.hashSync("123456", salt);

let users = [{
  username: "adminUser",
  email: "admin@example.com",
  password: hashedPassword,
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  username: "premiumUser",
  email: "premium@example.com",
  password: hashedPassword,
  role: "premium",
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  username: "standardUser",
  email: "standard@example.com",
  password: hashedPassword,
  role: "standard",
  createdAt: new Date(),
  updatedAt: new Date()
}];
/*
for(let i = 1; i <= 15; i++) {
  users.push({
    username: faker.internet.userName(),
    email: faker.internet.exampleEmail(),
    password: "123456",
    role: "standard",
    createdAt: new Date(),
    updatedAt: new Date()
  })
}
*/

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("Users", null, {});
  }
};
