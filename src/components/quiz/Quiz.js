import { useEffect, useRef, useState } from "react";
import classes from "./Quiz.module.css";
import image2 from "../../images/coding.jpg";
import { useHistory } from "react-router-dom";


const DUMMY_QUESTIONS = [
  {
    answers: [],
    type: "textarea",
    question: "chneya result taa hedhi",
    image: image2,
  },
  {
    answers: ["react", "angular", "vue"],
    type: "checkbox",
    question: "akwa wehed",
    image: "",
  },
  {
    answers: [],
    type: "textarea",
    question: "ki nekteb haka chneya resultat",
    image: "",
  },
];

const Quiz = () => {
  const [isActive, setActive] = useState(false);
  const [counter, setCounter] = useState(0);
  const [checked, setChecked] = useState([]);
  const [doneCheck,setDoneCheck] = useState(false)
  const history = useHistory()
  const checkboxInput = useRef([]);
  const textareaInput = useRef();

  useEffect(() => {
    if(doneCheck) {
     setTimeout(() => {
      history.replace("/user-profile")
     }, 3000);
    }
  },[doneCheck,history])

  const toggleHandler = () => {
    setActive(true);
  };

  const handleCheck = (event) => {
    var updatedList = [...checked]
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  }

  const formHandler = (event) => {
    event.preventDefault();

    if(DUMMY_QUESTIONS.length -1 >counter) {
      // console.log(DUMMY_QUESTIONS.length)
      // console.log(checked);
      // console.log(textareaInput.current.value);
      console.log(DUMMY_QUESTIONS.length -1)
      console.log(counter)
  
      setCounter((state) => state + 1);
    } else {
      setCounter((state) => state + 1);
      setDoneCheck(true)
      console.log(doneCheck)
    }


  };

  return (
    <div className={classes.container}>
      <div className={classes["questions-container"]}>
        {!isActive && (
          <div>
            <p>
              Hi Aziz125, so you have a quiz in Java . Click on Start whenever
              you re ready . Good Luck !
            </p>
            <button className={classes.button} onClick={toggleHandler}>
              Start
            </button>
          </div>
        )}
          {doneCheck && <p>Well done Aziz125 ! you completed the quiz successfully , you can check your results in your profile</p>}

        {(isActive && DUMMY_QUESTIONS.length -1 >= counter) ? <div className={classes.question}>
          <p>Question {counter +1} : {DUMMY_QUESTIONS[counter].question}</p>
          {DUMMY_QUESTIONS[counter].image && <img src={DUMMY_QUESTIONS[counter].image} alt="screenshot" />}
          </div> : "" }
      </div>
      {(isActive && DUMMY_QUESTIONS.length -1 >= counter) ? (
        <div className={classes["answers-container"]}>
          <form className={classes.form} onSubmit={formHandler}>
            {DUMMY_QUESTIONS[counter].type === "checkbox" &&
              DUMMY_QUESTIONS[counter].answers.map((item,index) => (
                <div className={classes.checkbox} key={index}>
                  <input
                    type="checkbox"
                    name="checkbox"
                    value={item}
                    ref={checkboxInput}
                    onChange={handleCheck}
                  />
                  <label htmlFor="checkbox">{item}</label>
                </div>
              ))}
            {DUMMY_QUESTIONS[counter].type === "textarea" && (
              <div>
                <label htmlFor="texting">Write your response</label>
                <textarea
                  name="texting"
                  rows="5"
                  ref={textareaInput}
                  className={classes.textarea}
                ></textarea>
              </div>
            )}

            <button className={classes.button}>{DUMMY_QUESTIONS.length -1 !== counter ? "Next question" : "Submit Quiz"}</button>
          </form>
        </div>
      ) : ""}
    </div>
  );
};

export default Quiz;
