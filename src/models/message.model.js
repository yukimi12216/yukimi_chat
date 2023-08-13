// message.model.js
"use strict";

const {
  UserMessages,
  sequelize,
  UserRooms,
  User,
  Room,
} = require("../../db/models");
const { Op } = require("sequelize");
const { isAdmin } = require("./users.model");

const clientRooms = [];

// recieveMessage関数を作り出す関数
const createReceiveMessage = function (roomId, userId) {
  return async function (message) {
    const t = await sequelize.transaction();
    try {
      const userMessage = await UserMessages.create(
        {
          room_id: roomId,
          user_id: userId,
          message,
        },
        { transaction: t }
      );

      // メッセージのデータにUserのデータを付与する
      const user = await User.findByPk(userId, { transaction: t });

      const data = { userMessage, user };

      // ルームの各参加者に通知する
      if (clientRooms[roomId] instanceof Set) {
        clientRooms[roomId].forEach((c) => c.send(JSON.stringify(data)));
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      console.log(err);
      return err;
    }
  };
};

const model = {
  addClient: function (ws, req) {
    const roomId = req.params.room_id;
    const userId = req.session.user_id;

    if (clientRooms[roomId] instanceof Set === false) {
      clientRooms[roomId] = new Set();
    }
    clientRooms[roomId].add(ws);

    const receiveMessage = createReceiveMessage(roomId, userId);
    ws.on("message", receiveMessage);
  },

  checkInRoom: async (req, res, next) => {
    // 部屋の従業員にUserが含まれていない場合は"/index"にリダイレクト
    const userId = req.session.user_id;
    const roomId = req.params.room_id;

    const userRoom = await UserRooms.findOne({
      where: {
        user_id: userId,
        room_id: roomId,
      },
    });

    if (userRoom === null) {
      res.redirect("/index");
      return;
    }

    next();
  },

  // 部屋にいる従業員及びメッセージの表示
  displayMessage: async (req, res) => {
    const roomId = req.params.room_id;

    const t = await sequelize.transaction();
    try {
      // 部屋の従業員の表示
      const users = await UserRooms.findAll(
        {
          include: User,
          where: {
            room_id: roomId,
          },
        },
        { transaction: t }
      );

      // メッセージの表示
      const messages = await UserMessages.findAll(
        {
          include: User,
          where: {
            room_id: roomId,
          },
        },
        { transaction: t }
      );
      await t.commit();
      res.render("pages/chatroom", { users, messages, roomId });
    } catch (err) {
      await t.rollback();
      console.log(err);
      res.redirect("/");
    }
  },

  checkLeader: async (req, res, next) => {
    // Userがルームのリーダでない場合は"/index/read_room/:room_id"にリダイレクト
    const userId = req.session.user_id;
    const user = await User.findByPk(userId);
    const admin = await isAdmin(userId);

    const roomId = req.params.room_id;
    const room = await Room.findByPk(roomId);
    if (room === null || (room.leader_name !== user.name && !admin)) {
      res.redirect(`/index/read_room/${roomId}`);
      return;
    }

    next();
  },

  // ユーザーを招待する画面の表示
  displayAddUser: async (req, res) => {
    const roomId = req.params.room_id;

    const t = await sequelize.transaction();
    try {
      await UserRooms.sync({}, { transaction: t });

      // 招待するルームのUserRoomsを取得
      const inRoomMembers = await UserRooms.findAll(
        {
          attributes: ["user_id"],
          where: { room_id: roomId },
        },
        { transaction: t }
      );

      // 取得したUserRoomsをuser_idの配列に変換
      const inRoomMemberIds = inRoomMembers.map((m) => m.user_id);

      // inRoomMemberIdsにidが含まれていないUserを取得
      const notInRoomMembers = await User.findAll(
        {
          where: {
            id: {
              [Op.ne]: req.session.user_id,
              [Op.notIn]: inRoomMemberIds,
            },
          },
        },
        { transaction: t }
      );
      res.render("pages/room_add_user", {
        members: notInRoomMembers,
        roomId,
      });
      await t.commit();
    } catch (err) {
      await t.rollback();
      console.log(err);
      res.redirect("/");
    }
  },

  addUser: async (req, res) => {
    const roomId = req.params.room_id;

    const t = await sequelize.transaction();
    try {
      if (Array.isArray(req.body.add)) {
        for (const obj of req.body.add) {
          await UserRooms.create(
            {
              room_id: roomId,
              user_id: obj,
            },
            { transaction: t }
          );
        }
      }
      await t.commit();
      res.redirect(`/index/read_room/${roomId}`);
    } catch (err) {
      await t.rollback();
      console.log(err);
      res.redirect("/");
    }
  },
  // ユーザーを退会させる画面の表示
  displayDeleteRoomUser: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      if (req.session.user_id === null) {
        res.redirect("/");
      } else {
        await UserRooms.sync({}, { transaction: t });
        const roomId = req.params.room_id;

        // 退会するルームのUserRoomsを取得
        const inRoomMembers = await UserRooms.findAll(
          {
            attributes: ["user_id"],
            include: User,
            where: { room_id: roomId },
          },
          { transaction: t }
        );
        res.render("pages/room_delete_user", {
          members: inRoomMembers,
          roomId,
        });
        await t.commit();
      }
    } catch (err) {
      await t.rollback();
      console.log(err);
      res.redirect("/");
    }
  },
  // ルームに存在するあるユーザーをルームから削除
  deleteRoomUser: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const roomId = req.params.room_id;
      const userId = req.body.user_id;
      await UserRooms.destroy(
        {
          where: {
            user_id: userId,
            room_id: roomId,
          },
        },
        { transaction: t }
      );
      if (userId === req.session.user_id) {
        res.redirect("/index");
      } else {
        res.redirect(`/index/read_room/${roomId}`);
      }
      await t.commit();
    } catch (err) {
      await t.rollback();
      console.log(err);
    }
  },

  createReceiveMessage,
};

module.exports = model;
