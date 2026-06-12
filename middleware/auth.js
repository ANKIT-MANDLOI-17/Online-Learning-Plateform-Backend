const jwt = require("jsonwebtoken");
const User = require("../models").userModel;

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send("Access denied");
    }

    const verified = jwt.verify(token, process.env.PASSPORT_SECRET);

    const user = await User.findById(verified._id);

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid token");
  }
};
