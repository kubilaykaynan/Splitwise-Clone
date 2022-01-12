const mongoose = require("mongoose");
const users_debt_Router = require("express").Router();
const users_debt = require("../models/users_debt");
const User = require("../models/Kullanicilar");
const Logs = require("../models/Logs");
const Group = require("../models/Group");

users_debt_Router.post("/add-debt", async (req, res) => {
  const { loggedInUser, money, toUser, group } = req.body;

  const foundLoggedUser = await User.findOne({ _id: loggedInUser._id });
  const foundToUser = await User.findOne({ _id: toUser._id });
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

  if (!foundLoggedUser) {
    res.status(400);
    return res.send({ message: "user not found" });
  }

  //updated date calculation
  var today = new Date();
  var date = today.getDate();
  var monthNumber = today.getMonth();
  var year = today.getFullYear();

  //If user has a debt before?
  const isInclude = foundLoggedUser.debt.some((debt) => foundToUser.debt.includes(debt.toString()));

  if (isInclude) {
    const filteredArray = foundLoggedUser.debt.filter((debt) => foundToUser.debt.includes(debt.toString()));
    const foundDebt = await users_debt.findOne({ _id: filteredArray.toString() });

    if (foundDebt.toUsername.toString() === foundLoggedUser.username.toString()) {
      const newDebt = parseInt(foundDebt.debt) - parseInt(money);

      const updatedDebt = await users_debt.findOneAndUpdate(
        { _id: filteredArray.toString() },
        {
          debt: newDebt,
        },
        { new: true }
      );

      const foundGroup = await Group.findOne({ _id: group._id });

      if (!foundGroup) {
        res.status(404);
        res.send({ error: "cannot found group" });
      }

      const newLog = await Logs.create({
        groupId: group._id,
        sender: foundDebt.toUsername,
        receiver: foundDebt.username,
        debt: parseInt(money),
        date: parseInt(date),
        month: months[monthNumber],
        year: parseInt(year),
      });

      await Group.findOneAndUpdate(
        { _id: group._id },
        {
          logs: [...foundGroup.logs, newLog._id],
        }
      );

      return res.send({
        debt: updatedDebt,
      });
    }
    const newDebt = parseInt(money) + parseInt(foundDebt.debt);
    const updatedDebt = await users_debt.findOneAndUpdate(
      { _id: filteredArray.toString() },
      {
        debt: newDebt,
      },
      { new: true }
    );

    const foundGroup = await Group.findOne({ _id: group._id });

    if (!foundGroup) {
      res.status(404);
      res.send({ error: "cannot found group" });
    }

    const newLog = await Logs.create({
      groupId: group._id,
      sender: foundDebt.username,
      receiver: foundDebt.toUsername,
      debt: parseInt(money),
      date: parseInt(date),
      month: months[monthNumber],
      year: parseInt(year),
    });

    await Group.findOneAndUpdate(
      { _id: group._id },
      {
        logs: [...foundGroup.logs, newLog._id],
      }
    );

    return res.send({
      debt: updatedDebt,
    });
  } else {
    const newDebt = await users_debt.create({
      username: loggedInUser.username,
      toUsername: toUser.username,
      debt: money,
    });

    const foundGroup = await Group.findOne({ _id: group._id });

    if (!foundGroup) {
      res.status(404);
      res.send({ error: "cannot found group" });
    }

    const newLog = await Logs.create({
      groupId: group._id,
      sender: newDebt.username,
      receiver: newDebt.toUsername,
      debt: parseInt(money),
      date: parseInt(date),
      month: months[monthNumber],
      year: parseInt(year),
    });

    await Group.findOneAndUpdate(
      { _id: group._id },
      {
        logs: [...foundGroup.logs, newLog._id],
      }
    );

    await User.findOneAndUpdate(
      { _id: foundLoggedUser._id },
      {
        debt: [...foundLoggedUser.debt, newDebt._id],
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: foundToUser._id },
      {
        debt: [...foundToUser.debt, newDebt._id],
      },
      { new: true }
    );

    return res.send({
      debt: newDebt,
    });
  }
});

users_debt_Router.post("/get-debts", async (req, res) => {
  const { user } = req.body;

  const foundUser = await User.findOne({ _id: user._id });

  if (!foundUser) {
    res.status(400);
    return res.send({ message: "user not found" });
  }

  const foundDebts = await users_debt.find({ _id: foundUser.debt });

  let result = false;
  let toUserDebt = [];

  for (let index = 0; index < foundDebts.length; index++) {
    if (foundDebts[index].username.toString() === user.username.toString()) {
      result = true;
    }
  }

  if (result) {
    toUserDebt = foundDebts.map((person) => {
      if (person.toUsername.toString() === user.username.toString()) {
        return;
      }
      return { toUser: person.toUsername, debt: person.debt };
    });
  } else {
    toUserDebt = foundDebts.map((person) => {
      if (person.toUsername.toString() !== user.username.toString()) {
        return;
      }
      return { toUser: person.username, debt: person.debt - person.debt * 2 };
    });
  }

  return res.send({
    toUserDebt,
  });
});

module.exports = users_debt_Router;
