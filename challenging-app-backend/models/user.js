const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema({
  nickname: {
    type: String,
    minlength: 5,
    unique: true,
  },
  email: { type: String, required: true, unique: true, minlength: 5 },
  password: { type: String, required: true, minLength: 5 },
  isAdmin: { type: Boolean, default: false },
  notes: { type: Array },
  quiz: { type: Array },
  avatar : {
    type:Buffer
}
  // imageUrl: {
  //   type: String,
  // },
});
schema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "3h" }
  );
  return token;
};

const User = mongoose.model("User", schema);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).email(),
    password: Joi.string().required().min(5),
    nickname: Joi.string().min(5),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
