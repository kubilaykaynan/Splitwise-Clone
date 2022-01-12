const mongoose = require("mongoose");

const LogsSchema = new mongoose.Schema(
  {
    groupId: {
      type: String,
      ref: "groups",
    },
    sender: {
      type: String,
    },
    receiver: {
      type: String,
    },
    debt: {
      type: Number,
    },
    date: {
      type: Number,
    },
    month: {
      type: String,
    },
    year: {
      type: Number,
    },
    comments: {
      type: [mongoose.Types.ObjectId],
      ref: "comment",
    },
  },
  { timestamps: true }
);

const Logs = mongoose.model("logs", LogsSchema);

module.exports = Logs;
