const mongoose = require("mongoose");
const { uploadFileCloudinary, base64Encoding } = require("../middleware/cloudinaryUpload");
const Group = require("../models/Group");
const GroupRouter = require("express").Router();
const User = require("../models/Kullanicilar");
const Comments = require("../models/Comments");
const Costs = require("../models/Costs");
// reads cloudinary env variable
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const Logs = require("../models/Logs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY,
});

GroupRouter.post("/add-group", async (req, res, next) => {
  const { user, groupName, groupDescription, photoUrl } = req.body;
  let url;
  if (!user || !groupName || !groupDescription) {
    return res.status(401).send({
      message: "All fields should be filled",
    });
  }

  const foundUser = await User.findById(mongoose.Types.ObjectId(user));

  if (!foundUser) {
    return res.status(401).send({
      message: "User not found",
    });
  }
  /*
  if (photoUrl) {
    try {
      const uploadResult = await uploadFileCloudinary(newFile, `${foundUser.username}/`);
      console.log(uploadResult);
      const searchResult = await cloudinary.search
        .expression(`${foundUser.username}/${groupName}`)
        .max_results(1)
        .execute();

      url = searchResult.url;
    } catch (error) {
      console.log(error);
    }
  }*/

  const newGroup = await new Group({
    name: groupName,
    description: groupDescription,
    members: [foundUser._id],
    photoUrl,
  }).save();

  const updatedUser = await User.findByIdAndUpdate(mongoose.Types.ObjectId(user), {
    joinedGroups: [...foundUser.joinedGroups, newGroup._id],
  });

  res.status(201).send({
    newGroup: {
      ...newGroup.toObject(),
    },
    updatedUser,
  });
});

GroupRouter.post("/add-member-to-group", async (req, res) => {
  const { users, groupId } = req.body;
  let numbers = [];

  users.map((person) =>
    person.phoneNumbers.map((number) => {
      numbers.push(number.digits);
    })
  );

  for (let index = 0; index < users.length; index++) {
    const foundUser = await User.findOne({ phoneNumber: numbers[index] });

    if (!foundUser) {
      const newUser = await User.create({
        name: users[index].name,
        username: users[index].name,
        surname: users[index].name,
        email: `${users[index].name}@gmail.com`,
        password: users[index].name,
        phoneNumber: numbers[index],
      });
      //Need to update group table's member
      const foundGroup = await Group.findOne({ _id: groupId });

      //const foundCreatedUser = await User.findOne({ name: users[index].name });

      await Group.findOneAndUpdate(
        { _id: groupId },
        {
          members: [...foundGroup.members, newUser._id],
        },
        { new: true }
      );

      await User.findOneAndUpdate(
        { _id: newUser._id },
        {
          joinedGroups: foundGroup._id,
        },
        { new: true }
      );
    } else {
      const foundGroup = await Group.findOne({ _id: groupId });

      if (foundGroup.members.some((member) => member.toString() === foundUser._id.toString())) {
        return res.status(400).send({
          message: "You can't add friend you already have.",
        });
      } else {
        await Group.findOneAndUpdate(
          { _id: groupId },
          {
            members: [...foundGroup.members, foundUser._id],
          },
          { new: true }
        );

        await User.findOneAndUpdate(
          { _id: foundUser._id },
          {
            joinedGroups: [...foundUser.joinedGroups, foundGroup._id],
          },
          { new: true }
        );
      }
    }
  }

  const updatedGroup = await Group.findOne({ _id: groupId });

  return res.status(201).send({
    updatedGroup,
  });
});

GroupRouter.post("/get-group-members", async (req, res) => {
  const { groupId, user } = req.body;

  const foundGroup = await Group.findById({ _id: groupId });

  if (!foundGroup) {
    res.status(400);
    return res.send({ message: "group not found" });
  }

  const membersId = foundGroup.members;

  const foundMembers = await User.find({ _id: membersId });

  if (!foundMembers) {
    res.status(400);
    return res.send({ message: "Member not found" });
  }

  var members = foundMembers.filter((person) => person.username.toString() != user.username.toString());

  return res.send({
    members: members,
  });
});

GroupRouter.post("/update-group", async (req, res) => {
  const { groupId, newGroupName } = req.body;

  const foundGroup = await Group.findById({ _id: groupId });

  if (!foundGroup) {
    res.status(404);
    return res.send({ message: "group not found" });
  }

  const updatedGroup = await Group.findOneAndUpdate(
    { _id: groupId },
    {
      name: newGroupName,
    },
    { new: true }
  );

  return res.send({
    updatedGroup,
  });
});

GroupRouter.post("/finish-group", async (req, res) => {
  const { groupId } = req.body;

  const foundGroup = await Group.findById({ _id: groupId });

  if (!foundGroup) {
    res.status(404);
    return res.send({ message: "group not found" });
  }

  const updatedGroup = await Group.findOneAndUpdate(
    { _id: groupId },
    {
      isAvailable: false,
    },
    { new: true }
  );

  return res.send({
    finishedGroup: updatedGroup,
  });
});

GroupRouter.post("/get-all-group-members", async (req, res) => {
  const { groupId } = req.body;

  const foundGroup = await Group.findById({ _id: groupId });

  if (!foundGroup) {
    res.status(400);
    return res.send({ message: "group not found" });
  }

  const membersId = foundGroup.members;
  const getMembers = await User.find({ _id: membersId });

  if (!getMembers) {
    res.status(404);
    return res.send({ failed: "cannot found member" });
  }

  return res.send({
    members: getMembers,
  });
});

GroupRouter.post("/delete-group", async (req, res) => {
  const { groupId } = req.body;

  const foundGroup = await Group.findOne({ _id: groupId });

  if (!foundGroup) {
    res.status(404);
    return res.send({ error: "cannot found group" });
  }

  const costs = foundGroup.costs;

  const foundCosts = await Costs.find({ _id: costs });

  const costComments = foundCosts.comments;

  const deletedCostComments = await Comments.remove({ _id: costComments });

  console.log("deleted comments:", deletedCostComments);

  const deletedCosts = await Costs.remove({ _id: costs });

  console.log("deleted costs:", deletedCosts);

  const logs = foundGroup.logs;

  const foundLogs = await Logs.find({ _id: logs });

  const logComments = foundLogs.comments;

  const deletedLogComments = await Comments.remove({ _id: logComments });

  const deletedLogs = await Logs.remove({ _id: logs });

  console.log("deleted logs:", deletedLogs);

  const deletedGroup = await Group.remove({ _id: groupId });

  return res.send({ deletedGroup, deletedLogs, deletedCosts, deletedCostComments, deletedLogComments });

  //const deletedGroup = await Group.findOneAndDelete({_id:groupId})
});

module.exports = GroupRouter;
