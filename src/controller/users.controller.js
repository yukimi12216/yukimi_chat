const express = require("express");
const router = express.Router();

const model = require("../models/user.model");



// ユーザーの登録
router.get("/login", model.displaylogin);
router.post("/login", model.login);

// ユーザーの認証
router.get("/register", model.displayregister);
router.post("/register", model.register);
router.post("/logout", model.logout);



module.exports=router;
