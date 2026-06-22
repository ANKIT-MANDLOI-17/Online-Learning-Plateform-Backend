const dotenv = require("dotenv");
dotenv.config();

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
const uri = process.env.DB_URL;
const cookieParser = require("cookie-parser");

const auth = require("./middleware/auth");

// connect to DB
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connect to Mongo Altas");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://online-learning-plateform-frontend-qvhf7ex9q.vercel.app",
      "https://online-learning-plateform-frontend-xi.vercel.app",
    ],
    credentials: true,
  }),
);

app.options("*", cors());

app.use("/api/user", authRoute);
app.use("/api/courses", auth, courseRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}.`);
});
