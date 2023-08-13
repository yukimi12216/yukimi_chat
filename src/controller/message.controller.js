// message.controller.js
"use strict";

const express = require("express");
const expressWs = require("express-ws");
const router = express.Router();
expressWs(router);

const model = require("../models/message.model");

router.ws("/:room_id", model.addClient);

router.use("/read_room/add_user/:room_id", model.checkLeader);
// ルームへ新たなユーザーを追加する画面の表示
router.get("/read_room/add_user/:room_id", model.displayAddUser);
// ルームへ新たなユーザーを追加
router.post("/read_room/add_user/:room_id", model.addUser);

router.use("/read_room/delete_user/:room_id", model.checkLeader);
// 退会させる画面の表示
router.get("/read_room/delete_user/:room_id", model.displayDeleteRoomUser);
// ルームへ指定のユーザーを退会
router.post("/read_room/delete_user/:room_id", model.deleteRoomUser);

router.use("/read_room/:room_id", model.checkInRoom);
// メッセージの表示
router.get("/read_room/:room_id", model.displayMessage);

module.exports = router;