// app.js
"use strict";
const express = require("express");
const expressWs = require("express-ws");
const session = require("cookie-session");

// Controllerを繋ぐ

const usersRouter=require("./src/controller/users.controller.js");

const roomRouter = require("./src/controller/room.controller.js");
const messageRouter = require("./src/controller/message.controller.js");
const userslistRouter = require("./src/controller/users_list.controller.js");
const { support } = require("jquery");

const set_opt = {
  name: "session",
  secret: "wakarinikui key",
  cookie: { maxAge: 60 * 70 * 1000 },
};

// 必要なミドルウェア
const app = express();
expressWs(app);
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use(session(set_opt));
// API設計

app.use("/users",usersRouter);
app.use("/index", roomRouter);
app.use("/index", messageRouter);
app.use("/index", userslistRouter);


app.get("/", (req, res) => {
  res.redirect("/users/login");
});

module.exports = app;
