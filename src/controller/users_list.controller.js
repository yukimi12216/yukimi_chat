// users_list.controller.js
"use strict";

const express = require("express");
const router = express.Router();

const users = require("../models/users.model");

// ユーザリストの表示
router.get("/read_users", users.displayUsers);

// ユーザ情報の更新
router.get("/read_users/update_user/:user_id", users.displayUpdateUser);
router.post("/read_users/update_user/:user_id", users.updateUser);

// ユーザの削除
router.get("/read_users/delete_user/:user_id", users.displayDeleteUser);
router.post("/read_users/delete_user/:user_id", users.deleteUser);

module.exports = router;
