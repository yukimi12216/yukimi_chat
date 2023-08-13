"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "Rooms",
      [
        {
          id: 1,
          name: "foo",
          leader_name: "foo",
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: 2,
          name: "hoge",
          leader_name: "hoge",
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: 3,
          name: "piyo",
          leader_name: "foo",
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Rooms", null, {});
  },
};
