const { hash } = require("bcryptjs");
const mongoose = require("mongoose");

const sema = mongoose.Schema;

const UsersSchema = new sema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    friends: {
      type: [mongoose.Types.ObjectId],
      ref: "user",
    },
    photoUrl: {
      type: String,
      default: "https://res.cloudinary.com/dsqdqmqfk/image/upload/v1640936123/kubi/Test%202.jpg",
      ref: "user",
    },
    joinedGroups: {
      type: [mongoose.Types.ObjectId],
      ref: "groups",
    },
    debt: {
      type: [mongoose.Types.ObjectId],
      ref: "debt",
    },
    phoneNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

UsersSchema.pre("save", async function (next) {
  const user = this;
  try {
    const hashedPassword = await hash(user.password, 5);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
// decrypt

//compare

const User = mongoose.model("users", UsersSchema);

module.exports = User;
