"use strict";

const testDb = require("../../../__test__/test_db");

const db = {
  User: {
    sequelize: {
      transaction: (cb) => cb(),
    },

    create: jest.fn(),

    update: jest.fn(),

    destroy: jest.fn(),

    findAll: jest.fn(),

    findByPk: function (pk) {
      if (typeof pk !== "number" || pk < 0 || pk >= testDb.users.length) {
        return null;
      }

      return Promise.resolve(testDb.users[pk]);
    },

    mockReset: function () {
      this.create.mockReset();
      this.update.mockReset();
      this.findAll.mockReset();
    },
  },

  Room: {
    sequelize: {
      transaction: (cb) => cb(),
    },

    findByPk: function (pk) {
      return Promise.resolve(testDb.rooms[pk]);
    },

    destroy: jest.fn(),

    mockReset: function () {
      this.destroy.mockReset();
    },
  },

  UserRooms: {
    sequelize: {
      transaction: (cb) => cb(),
    },

    sync: () => Promise.resolve(),

    create: jest.fn(),

    destroy: jest.fn(),

    findAll: jest.fn(),

    mockReset: function () {
      this.create.mockReset();
      this.destroy.mockReset();
      this.findAll.mockReset();
    },
  },

  UserMessages: {
    sequelize: {
      transaction: (cb) => cb(),
    },

    create: jest.fn(),

    destroy: jest.fn(),

    mockReset: function () {
      this.create.mockReset();
      this.destroy.mockReset();
    },
  },

  sequelize: {
    transaction: () =>
      Promise.resolve({
        commit: () => Promise.resolve(),
        rollback: () => Promise.resolve(),
      }),
  },
};

module.exports = db;
