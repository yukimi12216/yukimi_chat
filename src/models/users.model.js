// users.model.js

"use strict";

const { User, UserRooms, sequelize } = require("../../db/models");

let errorMessage = "";

function isOnlySpace(str) {
  return !str.match(/\S/g);
}

const users = {
    checkUser: async (req, res, next) => {
        // sessionにuser_idが存在しない場合は"/"にリダイレクト
        if ("session" in req === false || "user_id" in req.session === false) {
          res.redirect("/");
          return;
        }
    
        // Userが見つからない場合は"/"にリダイレクト
        const userId = req.session.user_id;
        const user = await User.findByPk(userId);
        if (user === null) {
          res.redirect("/");
          return;
        }
    
        next();
      },
}