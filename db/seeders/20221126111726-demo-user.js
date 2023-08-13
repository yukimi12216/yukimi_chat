"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        id: 1,
        name: "foo",
        password: "var",
        email: "foo@gmail.com",
        employee_id: "ee000001",
        employee_status: 2,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "hoge",
        password: "hoge",
        email: "hoge@gmail.com",
        employee_id: "ee000002",
        employee_status: 1,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "piyo",
        password: "piyo",
        email: "piyo@gmail.com",
        employee_id: "ee000003",
        employee_status: 0,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
