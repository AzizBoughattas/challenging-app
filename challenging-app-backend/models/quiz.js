const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  subject: { type: String, required: true,unique:true },
  user: [{
    nickname: {type:String},
    note: { type: Number },
    userAnswers: {type:Array}
  }],
  questions: [{
    question: { type: String, required: true },
    answers: { type: Array},
    image: { type: String },
    rightAnswer: { type: String, required: true },
  }],
  userNickname:{type:Array,required:true,validate:v => v.length>0}
});

const Quiz = mongoose.model("Quiz", schema);

function validateQuiz(quiz) {
  const schema = Joi.object({
    subject: Joi.string().required(),
    questions: Joi.array().required().min(1),
    userNickname:Joi.array().required().min(1)
  });

  return schema.validate(quiz);
}

exports.Quiz = Quiz;
exports.validateQuiz = validateQuiz;
