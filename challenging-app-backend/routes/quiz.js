const { Quiz, validateQuiz } = require("../models/quiz");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin =require('../middleware/admin')


async function checkUser(nicknames) {
  for (let i = 0; i < nicknames.length; i++) {
    const user = await User.find({ nickname: nicknames[i] });
    if (user.length === 0) {
      return false;
    }
  }
  return true;
}

router.post("/create",admin, async (req, res) => {
  const { error } = validateQuiz(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.userNickname.length !== 0) {
    const check = await checkUser(req.body.userNickname);


    if (!check) return res.status(400).send("please check nicknames");

    let users = await User.find();

    users.forEach((user, index) => {
      req.body.userNickname.forEach((nickname) => {
        if (user.nickname === nickname) {
          if (user.quiz.indexOf(req.body.subject) !== -1) {
            return res
              .status(400)
              .send(`sorry this user ${nickname} is already register in this quiz`);
          } else {
            user.quiz.push(req.body.subject);
            users[index].save();
            return;
          }
        }
      });
    });
  }

  let quiz = new Quiz({
    subject: req.body.subject,
    questions: req.body.questions,
    userNickname:req.body.userNickname
  });

  try {
    await quiz.save();
    res.send(quiz);
    console.log("quiz cye")
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/answer",auth, async (req, res) => {
  let quiz = await Quiz.find({ subject: req.body.subject });
  
  if (quiz.length === 0) return res.status(400).send("Subject not found ");
  let user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("User not found");
  if(user.quiz.indexOf(req.body.subject) === -1) return res.status(400).send("this User is not concerned about this quiz");


  const found = quiz[0].user.filter(
    (item) => item.userId.toString() === req.body.userId
  );
  if (found.length > 0)
    return res.status(400).send("sorry you already passed the quiz ");
  let note = 0;

  for (let i = 0; i < quiz[0].questions.length; i++) {
    if(req.body.userAnswers[i] === quiz[0].questions[i].rightAnswer) {
      note=note +1
    }
  }
  note = (note / quiz[0].questions.length).toFixed(2) * 100;
  console.log(note)

  const userResponse = {
    userId: req.body.userId,
    userAnswers: req.body.userAnswers,
    note: note,
  };

  quiz[0].user.push(userResponse);

  quiz[0].save();
  user.notes.push(note);
  user.quiz.splice(user.quiz.indexOf(req.body.subject), 1);

  user.save();

  res.send(quiz);
});

module.exports = router;