const jwt = require("jsonwebtoken");
const { User } = require("../models/user");


module.exports = async function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET,{complete: true});
    const user = await User.findOne({ _id :decoded.payload._id })

    if(!user) {
      throw new Error()
  }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
}
