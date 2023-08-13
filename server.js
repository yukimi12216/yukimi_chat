// server.js
"use strict";

const { User, Room, UserRooms, UserMessages } = require("./db/models");
const app = require("./app");
const port = 3000;

(async function () {
  await User.sync();
  await Room.sync();
  await UserRooms.sync();
  await UserMessages.sync();

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
})();
