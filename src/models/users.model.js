// users.model.js
/* eslint-disable */
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

  isAdmin: async (userId) => {
    const user = await User.findByPk(userId);
    if (user === null) {
      return false;
    }

    return user.employee_status === 2 || user.employee_status === 3;
  },

  displayUsers: async function (req, res) {
    try {
      const user = await User.findAll();
      const isAdmin = await users.isAdmin(req.session.user_id);
      res.render("pages/users_list", { user, isAdmin });
    } catch (err) {
      console.log(err);
      res.redirect("/index");
      return err;
    }
  },

  displayUpdateUser: async (req, res) => {
    const userId = req.params.user_id;
    const user = await User.findByPk(userId);
    res.render("pages/users_update", { user, errorMessage, userId });
    errorMessage = "";
  },

  updateUser: async (req, res) => {
    const userId = req.params.user_id;
    const t = await sequelize.transaction();
    try {
      switch (req.body.update_button) {
        case "update_name": {
          const newName = req.body.new_name;
          if (isOnlySpace(newName)) {
            errorMessage = "新しい名前が入力されていません";
            throw new Error();
          } else {
            User.update(
              { name: newName },
              { where: { user_id: userId } },
              { transaction: t }
            );
          }
          break;
        }
        case "update_password": {
          const newPass1 = req.body.new_pass1;
          const newPass2 = req.body.new_pass2;
          if (isOnlySpace(newPass1)) {
            errorMessage = "新しいパスワードが入力されていません";
            throw new Error();
          } else if (newPass1 !== newPass2) {
            errorMessage = "確認用と不一致です";
            throw new Error();
          } else {
            User.update(
              { password: newPass1 },
              { where: { user_id: userId } },
              { transaction: t }
            );
          }
          break;
        }
        case "update_status": {
          const newStatus = parseInt(req.body.new_status, 10);
          if (
            isNaN(newStatus) ||
            (newStatus !== 0 && newStatus !== 1 && newStatus !== 2)
          ) {
            errorMessage = "正しくないステータスです";
            throw new Error();
          } else {
            User.update(
              { employee_status: newStatus },
              { where: { user_id: userId } },
              { transaction: t }
            );
          }
          break;
        }
      }
      await t.commit();
      res.redirect("/index/read_users");
    } catch (err) {
      await t.rollback();
      console.log(err);
      res.redirect(`/index/read_users/update_user/${userId}`);
    }
  },

  displayDeleteUser: (req, res) => {
    const userId = req.params.user_id;

    res.render("pages/users_delete", { userId });
  },

  deleteUser: async (req, res) => {
    const userId = req.params.user_id;
    const t = await sequelize.transaction();
    try {
      await UserRooms.destroy(
        {
          where: { user_id: userId },
        },
        { transaction: t }
      );
      await User.destroy(
        {
          where: { id: userId },
        },
        { transaction: t }
      );
      await t.commit();
      res.redirect("/index/read_users");
    } catch (err) {
      await t.rollback();
      console.log(err);
      res.redirect(`/index/read_users/delete_user/${userId}`);
    }
  },
};

module.exports = users;
