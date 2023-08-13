// app.js
"use strict";
const express = require("express");
const expressWs = require("express-ws");

// **session�Ŏg��cookie-session��������Œǉ�

// Controller���q��

// **�����ӂ�users��router���K�v

const roomRouter = require("./src/controller/room.controller.js");
const messageRouter = require("./src/controller/message.controller.js");
const userslistRouter = require("./src/controller/users_list.controller.js");
const { support } = require("jquery");

// **������ӂŃZ�b�V������ݒ�

// �K�v�ȃ~�h���E�F�A
const app = express();
expressWs(app);
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));

// **�Z�b�V�����ݒ��app.use�������ɏ���

app.use(express.json());

// API�݌v

// **������ӂ�users�̃��[�g��ʂ�

app.use("/index", roomRouter);
app.use("/index", messageRouter);
app.use("/index", userslistRouter);


// **���� "/"�ɗ�����/index�ɔ�Ԃ��{���̓��O�C����ʂɔ�΂�
app.get("/", (req, res) => {
  res.redirect("/index");
});

module.exports = app;
