const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt')
const auth= require('../middleware/auth')

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
  res.send({user :user,token: 'Bearer '+token});
});

router.get("/",auth,async(req,res) => {
  const user = await User.find()
  res.send(user)
})



module.exports = router;
