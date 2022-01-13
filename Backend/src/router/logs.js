const mongoose = require("mongoose");
const Group = require("../models/Group");
const LogsRouter = require("express").Router();
const users_debt = require("../models/users_debt");
const Logs = require("../models/Logs");

LogsRouter.post("/get-logs", async (req, res) => {
  const { groupId } = req.body;

  const foundLogs = await Logs.find({ groupId: groupId });

  if (!foundLogs) {
    res.status(400);
    return res.send({
      message: "group logs cannot found",
    });
  }

  let logs = [];
  for (let index = 0; index < foundLogs.length; index++) {
    logs[index] = {
      id: foundLogs[index]._id,
      sender: foundLogs[index].sender,
      receiver: foundLogs[index].receiver,
      debt: foundLogs[index].debt,
      date: foundLogs[index].date,
      month: foundLogs[index].month,
      year: foundLogs[index].year,
    };
  }

  return res.send({
    Logs: logs.reverse(),
  });
});

module.exports = LogsRouter;
