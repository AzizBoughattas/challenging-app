const { Quiz, validateQuiz } = require("../models/quiz");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const jwt = require("jsonwebtoken");
const sendEmail = require("../email/email");

const output = `<p>Hello fellow colleaguesl</p>
<p>I hope this email finds you well</p> 
 <p>You are invited to pass an assessment. Please check your personal space to access it. Thank you in advance and have a good day.</p>
 <p>Sincerely
 </p>`;
 const plainText = `Hello fellow colleagues,I hope this email finds you well
 You are invited to pass an assessment. Please check your personal space to access it. Thank you in advance and have a good day.
 Sincerely
 `;

 const subject = "Assessment Invitation"

async function checkUser(nicknames) {
  for (let i = 0; i < nicknames.length; i++) {
    const user = await User.find({ nickname: nicknames[i] });
    if (user.length === 0) {
      return false;
    }
  }
  return true;
}

router.post("/create", admin, async (req, res) => {
  const { error } = validateQuiz(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let userEmail = [];
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
              .send(
                `sorry this user ${nickname} is already register in this quiz`
              );
          } else {
            userEmail.push(user.email);
            user.quiz.push(req.body.subject);
            users[index].save();
            return;
          }
        }
      });
    });
  }

  try {
    await sendEmail(userEmail,output,plainText,subject);
  } catch (error) {
    console.log(error);
  }

  let quiz = new Quiz({
    subject: req.body.subject,
    questions: req.body.questions,
    userNickname: req.body.userNickname,
  });

  try {
    await quiz.save();
    res.send(quiz);
    console.log("quiz cye");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/answer", auth, async (req, res) => {
  let quiz = await Quiz.find({ subject: req.body.subject });

  if (quiz.length === 0) return res.status(400).send("Subject not found ");
  let user = await User.findOne({ nickname: req.body.nickname });
  if (!user) return res.status(400).send("User not found");
  if (user.quiz.indexOf(req.body.subject) === -1)
    return res.status(400).send("this User is not concerned about this quiz");

  const found = quiz[0].user.filter(
    (item) => item.nickname.toString() === req.body.nickname
  );
  if (found.length > 0)
    return res.status(400).send("sorry you already passed the quiz ");
  let note = 0;

  for (let i = 0; i < quiz[0].questions.length; i++) {
    if (req.body.userAnswers[i] === quiz[0].questions[i].rightAnswer) {
      note = note + 1;
    }
  }
  note = (note / quiz[0].questions.length).toFixed(2) * 100;
  console.log(note);

  const userResponse = {
    nickname: req.body.nickname,
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

router.get("/", auth, async (req, res) => {
  const token = req.header("Authorization");
  const payload = jwt.decode(token);
  const user = await User.findOne({ _id: payload._id });

  if (user.quiz.length !== 0) {
    const quiz = await Quiz.findOne({ subject: user.quiz[0] });
    res.send(quiz);
  } else {
    res.status(400).send("Cant find this quiz");
  }
});
router.get("/myquiz", auth, async (req, res) => {
  const token = req.header("Authorization");
  const payload = jwt.decode(token);
  const quiz = await Quiz.find();
  const user = await User.findOne({ _id: payload._id });
  const result = [];

  quiz.forEach((quiz) => {
    if (quiz.user.length !== 0) {
      quiz.user.forEach((userr) => {
        if (userr.nickname === user.nickname) {
          result.push({ subject: quiz.subject, note: userr.note });
        }
      });
    }
  });
  res.send(result);
});

router.get("/allquiz", auth, async (req, res) => {
  const quiz = await Quiz.find();

  const notet = [];
  quiz.forEach((item) => {
    item.user.forEach((user) => {
      const exist = notet.find((data, index) => data.nickname === user.nickname);
      if (exist) {
        notet.forEach((ite2, index) => {
          if (ite2.nickname === user.nickname) {
            notet[index].note += user.note;
            notet[index].quiz += 1;
          } 
        });
      } else {
        notet.push({
          nickname: user.nickname,
          note: user.note,
          quiz: 1,
        });
      }
    });
  });

  notet.forEach((item) => {
    item.note=item.note/item.quiz
    delete item.quiz
  })

  res.send(notet);
});

module.exports = router;
