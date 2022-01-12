const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "group",
    },
    logId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "logs",
    },
    comment: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      ref: "user",
    },
  },
  { timestamps: true }
);

const comments = mongoose.model("comments", CommentsSchema);

module.exports = comments;
