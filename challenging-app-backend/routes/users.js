const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt')
const admin = require('../middleware/admin')
const jwt = require("jsonwebtoken");
const auth = require('../middleware/auth')

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registred");

  user = new User({
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateAuthToken()

  await user.save();
  res.send({email:user.email,isAdmin:user.isAdmin,nickname:user.nickname,token:token});
});

router.get("/",admin,async(req,res) => {
  const user = await User.find()
  res.send(user)
})
router.get("/me",auth,async(req,res) => {
  const token = req.header("Authorization")
  const payload = jwt.decode(token)
  const user = await User.findOne({ _id :payload._id })
  res.send(user)
})





module.exports = router;
