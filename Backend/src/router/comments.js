const mongoose = require("mongoose");
const comments_Router = require("express").Router();
const Logs = require("../models/Logs");
const User = require("../models/Kullanicilar");
const Group = require("../models/Group");
const Comments = require("../models/Comments");
const Costs = require("../models/Costs");

comments_Router.post("/add-comment", async (req, res) => {
  const { username, comment, groupId, logId } = req.body;

  const foundGroup = await Group.findOne({ _id: groupId });

  const foundUser = await User.findOne({ username: username });

  if (!foundGroup || !foundUser) {
    res.status(404);
    return res.send({ error: "cannot found username, group or log" });
  }

  const usersGroups = foundUser.joinedGroups;

  const isUserInGroup = Group.findOne({ _id: usersGroups });

  if (!isUserInGroup) {
    res.status(404);
    return res.send({ error: "user is not a member of this group" });
  }

  var dt = new Date();

  const currentDate = `${(dt.getMonth() + 1).toString().padStart(2, "0")}/${dt
    .getDate()
    .toString()
    .padStart(2, "0")}/${dt.getFullYear().toString().padStart(4, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`;

  const newComment = await Comments.create({
    groupId,
    username,
    comment,
    date: currentDate,
    logId,
  });

  const foundLog = await Logs.findOne({ _id: logId });

  if (foundLog) {
    await Logs.findOneAndUpdate(
      { _id: logId },
      {
        comments: [...foundLog.comments, newComment._id],
      }
    );
    return res.send({
      comment: newComment,
    });
  }

  const foundCostLog = await Costs.findOne({ _id: logId });
  if (!foundCostLog) {
    res.status(404);
    res.send({ error: "cannot found log" });
  }
  await Costs.findOneAndUpdate(
    { _id: logId },
    {
      comments: [...foundCostLog.comments, newComment._id],
    },
    { new: true }
  );

  return res.send({
    comment: newComment,
  });
});

comments_Router.post("/get-comments", async (req, res) => {
  const { groupId, logId } = req.body;

  const foundGroup = await Group.findOne({ _id: groupId });

  if (!foundGroup) {
    res.status(404);
    return res.send({ error: "cannot found group" });
  }

  const foundLog = await Logs.findOne({ _id: logId });

  if (!foundLog) {
    const foundCostLog = await Costs.findOne({ _id: logId });

    if (!foundCostLog) {
      res.status(404);
      return res.send({ error: "cannot found log" });
    }

    const foundComments = await Comments.find({ groupId: groupId, logId: foundCostLog._id });

    return res.send({
      comments: foundComments,
    });
  }

  const foundComments = await Comments.find({ groupId: groupId, logId: foundLog._id });

  return res.send({
    comments: foundComments,
  });
});

module.exports = comments_Router;
