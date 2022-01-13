const mongoose = require("mongoose");
const costs_Router = require("express").Router();
const Costs = require("../models/Costs");
const Logs = require("../models/Logs");
const User = require("../models/Kullanicilar");
const Group = require("../models/Group");

costs_Router.post("/add-costs", async (req, res) => {
  const { costs, username } = req.body;
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

  const foundUser = await User.findOne({ username });

  if (!foundUser) {
    res.status(400);
    return res.send({ message: "user not found" });
  }

  const foundGroup = await Group.findOne({ _id: costs.groupId });

  if (!foundGroup) {
    res.status(400);
    return res.send({ message: "group not found" });
  }

  var today = new Date();
  var date = today.getDate();
  var monthNumber = today.getMonth();
  var year = today.getFullYear();

  const newCost = await Costs.create({
    username,
    costType: costs.costType,
    groupId: costs.groupId,
    cost: costs.cost,
    description: costs?.description,
    costPhotoUri: costs?.image,
    date: parseInt(date),
    month: months[monthNumber],
    year: parseInt(year),
  });

  await Group.findOneAndUpdate(
    { _id: foundGroup._id },
    {
      costs: [...foundGroup.costs, newCost._id],
    },
    { new: true }
  );

  //Logs create

  return res.send({
    costs: newCost,
  });
});

costs_Router.post("/get-cost-logs", async (req, res) => {
  const { groupId } = req.body;

  const foundCost = await Costs.find({ groupId: groupId });

  if (!foundCost) {
    res.status(400);
    return res.send({
      message: "group logs cannot found",
    });
  }

  let logs = [];
  for (let index = 0; index < foundCost.length; index++) {
    logs[index] = {
      id: foundCost[index]._id,
      username: foundCost[index].username,
      description: foundCost[index].description,
      cost: foundCost[index].cost,
      date: foundCost[index].date,
      month: foundCost[index].month,
      year: foundCost[index].year,
      costPhotoUri: foundCost[index].costPhotoUri,
      costType: foundCost[index].costType,
    };
  }

  return res.send({
    logs: logs.reverse(),
  });
});

module.exports = costs_Router;
