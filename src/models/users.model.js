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
  displaylogin: async (req, res) => {
    try {
      res.render("pages/users_login.ejs");
    } catch (err) {
      console.log(err);
      res.redirect("/users/login");
      return err;
    }
  },
  login: async (req, res, next) => {
    try {  const employee_id = req.body.employee_id;
      const password = req.body.password;
      const compare = await User.findOne({
        where: {
          employee_id,
          password,
        },
      });
      if (compare === null) {
        res.redirect("/users/login");
      } else {
        req.session.user_id = compare.id;
        console.log(compare.id);
        res.redirect("/index");
      }
    }
    catch (err) {
      console.log(err);
      res.redirect("/users/login");
      return err;
    }},
    

  displayregister: async (req, res) => {
    try {
      res.render("pages/users_register.ejs");
    } catch (err) {
      console.log(err);
      res.redirect("/users/register");
      return err;
    }
  },
    
  register: async (req, res) => {
    try {
      await User.sequelize.transaction(async (t) => {
        const inputName = req.body.name;
        const inputPassword = req.body.password;
        const inputEmail = req.body.email;
        const inputId = req.body.employee_id;

        const user = await User.create(
          {
            name: inputName,
            password: inputPassword,
            email: inputEmail,
            employee_id: inputId,
          },
          { transaction: t }
        );

        // 全体チャットに追加する
        await UserRooms.create(
          {
            room_id: 0,
            user_id: user.id,
          },
          { transaction: t }
        );

        res.redirect("/users/login");
      });
    } catch (err) {
      console.log(err);
      res.redirect("/users/register");
      return err;
    }
  },


  logout: async (req, res) => {
    try {
      await req.session.destroy
      res.redirect('/users/login');
    }
      
     catch (err) {
      console.log(err);
      res.redirect("/users/login");
      return err;
    }
  },




    
  
};



module.exports = users;
