// app.js
"use strict";
const express = require("express");
const expressWs = require("express-ws");

// **sessionで使うcookie-sessionをここらで追加

// Controllerを繋ぐ

// **ここ辺でusersのrouterが必要

const roomRouter = require("./src/controller/room.controller.js");
const messageRouter = require("./src/controller/message.controller.js");
const userslistRouter = require("./src/controller/users_list.controller.js");
const { support } = require("jquery");

// **ここら辺でセッションを設定

// 必要なミドルウェア
const app = express();
expressWs(app);
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));

// **セッション設定のapp.useをここに書く

app.use(express.json());

// API設計

// **ここら辺にusersのルートを通す

app.use("/index", roomRouter);
app.use("/index", messageRouter);
app.use("/index", userslistRouter);


// **現状 "/"に来たら/indexに飛ぶが本当はログイン画面に飛ばす
app.get("/index", (req, res) => {
  res.redirect("/index");
});

module.exports = app;
