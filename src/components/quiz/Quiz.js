import { useEffect, useRef, useState } from "react";
import classes from "./Quiz.module.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { quizAnswers } from "../../store/quiz-actions";

const Quiz = () => {
  const [isActive, setActive] = useState(false);
  const [counter, setCounter] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [doneCheck, setDoneCheck] = useState(false);
  const [cardName, setCardName] = useState();
  const [subject, setSubject] = useState();
  const dispatch = useDispatch();
  const nickname = useSelector((state) => state.auth.nickname);
  const notification = useSelector((state) => {

    return state.ui.notification;
  });
  const checkboxInput = useRef([]);
  const textareaInput = useRef();

  useEffect(() => {
    axios.get("http://localhost:8080/api/quiz").then((res) => {
      setQuestions(res.data.questions);
      setSubject(res.data.subject);
    });
  }, []);

  const toggleHandler = () => {
    setActive(true);
  };

  const handleChange = (event, question) => {
    const newState = [...answers];
    if (cardName === question) {
      newState[newState.length === 0 ? 0 : newState.length - 1] =
        event.target.value;
      setAnswers(newState);
    } else {
      setCardName(question);
      setAnswers((state) => [...state, event.target.value]);
    }
  };

  const formHandler = (event) => {
    event.preventDefault();
    console.log(answers);

    if (questions.length - 1 > counter) {
      setCounter((state) => state + 1);
    } else {
      const data = {
        subject: subject,
        userAnswers: answers,
        nickname: nickname,
      };
      console.log(data);
      dispatch(quizAnswers(data));
      setCounter((state) => state + 1);
      setDoneCheck(true);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes["questions-container"]}>
        {!isActive && (
          <div>
            <p>
              Hi {nickname}, so you have a quiz in {subject} . Click on Start
              whenever you re ready . Good Luck !
            </p>
            <button className={classes.button} onClick={toggleHandler}>
              Start
            </button>
          </div>
        )}
        {doneCheck && (
          <p>
            Well done {nickname} ! you completed the quiz successfully , you can
            check your results in your profile
          </p>
        )}


        {isActive && questions.length - 1 >= counter ? (
          <div className={classes.question}>
            <p>
              Question {counter + 1} : {questions[counter].question}
            </p>
            {questions[counter].image && (
              <img src={questions[counter].image} alt="screenshot" />
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      {isActive && questions.length - 1 >= counter ? (
        <div className={classes["answers-container"]}>
          <form className={classes.form} onSubmit={formHandler}>
            {questions[counter].answers.length !== 0 &&
              questions[counter].answers.map((item, index) => (
                <div className={classes.checkbox} key={index}>
                  <input
                    type="radio"
                    name="radio"
                    value={item}
                    ref={checkboxInput}
                    onChange={(e) =>
                      handleChange(e, questions[counter].question)
                    }
                  />
                  <label htmlFor="radio">{item}</label>
                </div>
              ))}
            {questions[counter].answers.length === 0 && (
              <div>
                <label htmlFor="texting">Write your response</label>
                <textarea
                  name="texting"
                  rows="5"
                  ref={textareaInput}
                  className={classes.textarea}
                  onChange={(e) => handleChange(e, questions[counter].question)}
                ></textarea>
              </div>
            )}

            <button className={classes.button}>
              {questions.length - 1 !== counter
                ? "Next question"
                : "Submit Quiz"}
            </button>
          </form>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Quiz;
