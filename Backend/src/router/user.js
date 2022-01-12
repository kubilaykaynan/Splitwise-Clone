const mongoose = require("mongoose");
const User = require("../models/Kullanicilar");
const UserRouter = require("express").Router();
const { compare } = require("bcryptjs");
const Groups = require("../models/Group");

UserRouter.post("/login", async (req, res, next) => {
  const { kullaniciAdi, sifre } = req.body;

  if (!kullaniciAdi || !sifre) {
    res.status(399);
    return res.json({ hata: "Eksik alan bırakılmıştır" });
  }

  const foundUser = await User.findOne({ username: kullaniciAdi });
  if (!foundUser) {
    res.status(399);
    return res.json({ hata: "Kullanici bulunamadi" });
  }

  const decPassword = await compare(sifre, foundUser.password);

  if (!decPassword) {
    return res.status(404).json({ hata: "Sifre hatali" });
  } else {
    return res.json({
      ...foundUser.toObject(),
    });
  }
});
//search bar getting user
UserRouter.get("/searchUsers", async (req, res) => {
  try {
    let username = req.query.username;

    console.log("username", username);
    const foundUsers = await User.find({
      username: { $regex: username, $options: "i" },
    });

    return res.send({ users: foundUsers });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
});

UserRouter.post("/register", async (req, res) => {
  const { adi, soyadi, email, kullaniciAdi, sifre } = req.body;

  console.log("req boyd", req.body);
  const foundUser = await User.findOne({
    username: kullaniciAdi,
  });

  if (foundUser) {
    return res.status(400).send({
      message: "User already exist",
    });
  } else {
    const newUser = await User.create({
      name: adi,
      username: kullaniciAdi,
      surname: soyadi,
      email: email,
      password: sifre,
    });
    res.send({
      data: newUser,
    });
  }
});

//add a friend function
UserRouter.post("/addFriends", async (req, res) => {
  try {
    const { me, to } = req.body;
    console.log("me:", me, "to:", to);
    const foundUser = await User.findOne({ _id: me });
    const toUser = await User.findOne({ _id: to });
    if (!foundUser || !toUser) {
      return res.status(400).send({
        message: "User not found",
      });
    }

    //Check if a friend is you
    if (me === to) {
      return res.status(400).send({
        message: "A friend cannot be you.",
      });
    }

    // check if you have friends already
    if (foundUser.friends.some((friend) => friend.toString() === to.toString())) {
      return res.status(400).send({
        message: "You can't add friend you already have.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      mongoose.Types.ObjectId(me),
      {
        friends: [...foundUser.friends, toUser._id],
      },
      { new: true }
    );

    return res.json({
      updatedUser,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

// get all users
UserRouter.get("/users", async (req, res) => {
  const users = await User.find({});
  res.json({
    users,
  });
});

// get one user
/*UserRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(399);
    return res.json({ message: "you must provide id" });
  }

  const findAccount = User.findOne({ _id: id });

  if (!findAccount) {
    res.status(399);
    return res.json({ message: "User not found" });
  } else {
    res.json({
      ...findAccount.toObject(),
    });
  }
});*/

//get a friends of a user who has loged in
UserRouter.post("/getFriends", async (req, res) => {
  const { username } = req.body;

  const foundUser = await User.findOne({ username });

  if (!foundUser) {
    res.status(400);
    return res.json({ message: "User not found" });
  }

  const friendsId = foundUser.friends;

  const foundFriends = await User.find({ _id: friendsId });

  if (!foundFriends) {
    res.status(400);
    return res.json({ message: "Friends not found" });
  }

  return res.json({
    friends: foundFriends,
  });
});

UserRouter.post("/removeFriend", async (req, res) => {
  const { user_id, removeFriend_id } = req.body;

  console.log("username : ", user_id, "remove friend id", removeFriend_id);

  const foundUser = await User.findOne({ user_id });

  if (!foundUser) {
    res.status(400);
    return res.json({ message: "User not found" });
  }

  const removeFriend = User.findOneAndUpdate({ _id: user_id }, { $pull: { friends: removeFriend_id } }, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "error in deleting address" });
    }

    res.json({ message: "friend removed" });
  });
});

UserRouter.post("/getGroups", async (req, res) => {
  const { id } = req.body;

  const foundUser = await User.findOne({ _id: id });

  if (!foundUser) {
    res.send({ error: "user doesnt exist" });
    return;
  }

  const foundGroups = await Groups.find({ _id: foundUser.joinedGroups });

  if (!foundGroups) {
    res.status(400);
    return res.json({ error: "Group not found" });
  } else {
    return res.json(foundGroups);
  }
});

module.exports = UserRouter;
