const mongoose = require("mongoose");

const CostsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    costType: {
      type: String,
      required: true,
    },
    groupId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "group",
    },
    cost: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: null,
    },
    costPhotoUri: {
      type: String,
      default: null,
    },
    date: {
      type: String,
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

const costs = mongoose.model("costs", CostsSchema);

module.exports = costs;
