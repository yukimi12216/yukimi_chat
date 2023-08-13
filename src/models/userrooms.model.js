// userrooms.model.js
"use strict";

const {
  UserRooms,
  Room,
  User,
  UserMessages,
  sequelize,
} = require("../../db/models");

const { Op } = require("sequelize");
const users = require("./users.model");
const { isAdmin } = require("./users.model");
const model = {
    displayRooom: async (req, res) => {
        const userId = req.session.user_id;
    
        const t = await sequelize.transaction();
        try {
          await UserRooms.sync({}, { transaction: t });
          const groups = await UserRooms.findAll(
            {
              include: Room,
              where: {
                user_id: userId,
              },
            },
            { transaction: t }
          );
          res.render("pages/toppage", { groups });
          await t.commit();
        } catch (err) {
          await t.rollback();
          console.log(err);
          res.redirect("/");
        }
    },
    displayCreateRoom: async (req, res) => {
      const userId = req.session.user_id;
  
      const t = await sequelize.transaction();
      try {
        await UserRooms.sync({}, { transaction: t });
        console.log(userId);
        const members = await User.findAll(
          {
            where: {
              id: {
                [Op.ne]: userId,
              },
            },
          },
          { transaction: t }
        );
        console.log(members);
        res.render("pages/room_create_page", { members });
        await t.commit();
      } catch (err) {
        await t.rollback();
        console.log(err);
        res.redirect("/");
      }
    },
  
    checkStatus: async (req, res, next) => {
      // 権限が無い場合は"/index"にリダイレクト
      const userId = req.session.user_id;
      const admin = await users.isAdmin(userId);
      if (!admin) {
        res.redirect("/index");
        return;
      }
  
      next();
    },
  
    createRoom: async (req, res) => {
      const userId = req.session.user_id;
      const leader = await User.findByPk(userId);
  
      if (!req.body.name.match(/\S/g)) {
        res.redirect("/index/create_room");
        return;
      }
  
      const t = await sequelize.transaction();
      try {
        const newRoom = await Room.create(
          {
            name: req.body.name,
            leader_name: leader.name,
          },
          { transaction: t }
        );
        await UserRooms.create(
          {
            room_id: newRoom.id,
            user_id: userId,
          },
          { transaction: t }
        );
        if (Array.isArray(req.body.add)) {
          for (const obj of req.body.add) {
            await UserRooms.create(
              {
                room_id: newRoom.id,
                user_id: obj,
              },
              { transaction: t }
            );
          }
        }
        await t.commit();
        res.redirect("/index");
      } catch (err) {
        await t.rollback();
        console.log(err);
        res.redirect("/");
      }
    },
    displayUpdateRoom: (req, res) => {
      const roomId = req.params.room_id;
      res.render("pages/room_update_page", { roomId });
    },
  
    updateRoom: async (req, res) => {
      const t = await sequelize.transaction();
      try {
        const roomId = req.params.room_id;
        const roomName = req.body.roomName;
        await Room.update(
          { name: roomName },
          { where: { id: roomId } },
          { transaction: t }
        );
        await t.commit();
      } catch (err) {
        await t.rollback();
        console.log(err);
      }
      res.redirect("/index");
    },
  
    checkLeader: async (req, res, next) => {
      // Userがルームのリーダでない場合は"/index"にリダイレクト
      const userId = req.session.user_id;
      const user = await User.findByPk(userId);
      const admin = await isAdmin(userId);
  
      const roomId = req.params.room_id;
      const room = await Room.findByPk(roomId);
      if (room === null || (room.leader_name !== user.name && !admin)) {
        res.redirect("/index");
        return;
      }
  
      next();
    },
  
    displayDeleteRoom: async (req, res) => {
      const roomId = req.params.room_id;
  
      res.render("pages/room_delete_page", { roomId });
    },
  
    deleteRoom: async (req, res) => {
      const roomId = req.params.room_id;
  
      const t = await sequelize.transaction();
      try {
        await UserRooms.destroy(
          {
            where: { room_id: roomId },
          },
          { transaction: t }
        );
        await UserMessages.destroy(
          {
            where: { room_id: roomId },
          },
          { transaction: t }
        );
        await Room.destroy(
          {
            where: { id: roomId },
          },
          { transaction: t }
        );
        await t.commit();
      } catch (err) {
        await t.rollback();
        console.log(err);
      }
  
      res.redirect("/index");
    },
};

module.exports = model;
