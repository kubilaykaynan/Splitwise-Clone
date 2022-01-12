const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { response, request, Router } = require("express");
// for the local
var localUri = "mongodb://localhost:27017/bitirme";
const connectUrl = "mongodb+srv://admin:kubi@cluster0.nu5xq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const cors = require("cors");
const app = express();
const UserRouter = require("./src/router/user");
const Auth = require("./src/middleware/auth");
const GroupRouter = require("./src/router/group");
const users_debt_Router = require("./src/router/users_debt");
const LogsRouter = require("./src/router/logs");
const costs_Router = require("./src/router/costs");
const comments_Router = require("./src/router/comments");
require("dotenv").config();
//const cloudinary = require("cloudinary");

/*console.log("CLOUD NAMEEE", process.env.CLOUD_NAME);
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY,
});*/

mongoose.connect(
  connectUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      throw err;
    }
    console.log("Mongoose ile bağlantı kuruldu.");
  }
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send({ message: "kubi" });
});
app.use(UserRouter);

app.use(GroupRouter);

app.use(users_debt_Router);

app.use(LogsRouter);

app.use(costs_Router);

app.use(comments_Router);

app.listen(3100, () => {
  console.log("listening 3100 port");
});
