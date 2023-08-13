// room.controller.js

const express = require("express");
const router = express.Router();

const userModel = require("../models/user.model");
const model = require("../models/userrooms.model");

router.use(userModel.checkUser);

router.get("/", model.displayRooom);

// 部屋の作成
router.use("/create_room", model.checkStatus);
router.get("/create_room", model.displayCreateRoom);
router.post("/create_room", model.createRoom);

// 部屋の編集
router.use("/update_room/:room_id", model.checkLeader);
router.get("/update_room/:room_id", model.displayUpdateRoom);
router.post("/update_room/:room_id", model.updateRoom);

// 部屋の削除
router.use("/delete_room/:room_id", model.checkLeader);
router.get("/delete_room/:room_id", model.displayDeleteRoom);
router.post("/delete_room/:room_id", model.deleteRoom);

module.exports = router;
