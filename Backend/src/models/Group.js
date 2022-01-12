const mongoose = require("mongoose");

const GroupsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    members: {
      type: [mongoose.Types.ObjectId],
      ref: "user",
    },
    logs: {
      type: [mongoose.Types.ObjectId],
      ref: "logs",
    },
    photoUrl: {
      type: String,
      default: "https://res.cloudinary.com/dsqdqmqfk/image/upload/v1640446480/kubi/Test.jpg",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    costs: {
      type: [mongoose.Types.ObjectId],
      ref: "costs",
    },
  },
  { timestamps: true }
);

const Groups = mongoose.model("groups", GroupsSchema);

module.exports = Groups;
