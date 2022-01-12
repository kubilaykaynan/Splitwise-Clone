const mongoose = require("mongoose");

const UsersDebtSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    toUsername: {
      type: String,
      required: true,
    },
    debt: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const users_debt = mongoose.model("users_debt", UsersDebtSchema);

module.exports = users_debt;
