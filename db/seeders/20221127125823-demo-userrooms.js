"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "UserRooms",
      [
        {
          id: 1,
          user_id: 1,
          room_id: 0,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: 2,
          user_id: 2,
          room_id: 0,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: 3,
          user_id: 0,
          room_id: 1,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: 4,
          user_id: 1,
          room_id: 1,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: 5,
          user_id: 0,
          room_id: 2,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserRooms", null, {});
  },
};
