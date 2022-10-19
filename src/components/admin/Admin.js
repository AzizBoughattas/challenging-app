import { useEffect, useRef, useState } from "react";
import classes from "./Admin.module.css";
import { BsPlusLg } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { quizActions } from "../../store/quiz";
import Select from "react-select";
import axios from "axios";
import { createQuiz } from "../../store/quiz-actions";




const Admin = (props) => {
  function fetchData() {
    axios.get("http://localhost:8080/api/users").then((response) => {
      setUsers(
        response.data.map((item) => {
          return { value: item.nickname, label: item.nickname };
        })
      );
    });
  }
  useEffect(() => {
    fetchData();
  }, []);
  const [users, setUsers] = useState();
  const [toggleHandler, setToggleHandler] = useState();
  const [toggleQuiz, setToggleQuiz] = useState(false);
  const [imageUrl, setImageUrl] = useState(false);
  const [counter, setCounter] = useState(0);
  const [propositions, setPropositions] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const subjectRef = useRef();


  const [userSelect, setUserSelect] = useState(true);
  const [questionIsValid, setQuestionIsValid] = useState(true);
  const [imageIsValid, setImageIsValid] = useState(true);
  const [rightAnswerIsValid, setRightAnswerIsValid] = useState(true);
  const [subjectIsValid, setSubjectIsValid] = useState(true);
  const [questions, setQuestions] = useState([]);


  const questionInputRef = useRef();
  const imageInputRef = useRef();
  const rightAnswerRef = useRef();
  const dispatch = useDispatch();


  const validateQuiz = async () => {
    const subjectInput = subjectRef.current.value;
    if (subjectInput.trim() === "") {
      setSubjectIsValid(false);
      return false;
    } else {
      setSubjectIsValid(true);
    }
    if (selectedOption.length === 0) {
      setUserSelect(false);
      return false;
    } else {
      setUserSelect(true);
    }
    return true;
  };

  const validateInput = async (data) => {
    console.log(data.propositions);
    const propositions = [];

    if (data.questionInput.trim() === "") {
      setQuestionIsValid(false);
      return false;
    } else {
      setQuestionIsValid(true);
    }

    for (const item of data.propositions) {
      if (item.prop.trim() === "" || undefined) {
      } else {
        propositions.push(item.prop);
      }
    }

    if (data.imageInput.trim() !== "") {
      if (data.imageInput.match(/\.(jpeg|jpg|gif|png)$/) === null) {
        setImageIsValid(false);
        return false;
      } else {
        setImageIsValid(true);
      }
    }

    if (data.rightAnswer.trim() === "") {
      setRightAnswerIsValid(false);
      return false;
    } else {
      setRightAnswerIsValid(true);
    }
    return {
      question: data.questionInput,
      answers: propositions,
      image: data.imageInput,
      rightAnswer: data.rightAnswer,
    };
  };

  const handleChange = (event, index) => {
    const { value, name } = event.target;

    const newState = [...propositions];

    newState[index] = {
      ...newState[index],
      [name]: value,
    };

    setPropositions(newState);
  };

  const addCounter = () => {
    if (counter < 5) setCounter((state) => state + 1);
  };

  const toggleContainer = (e) => {
    if(e.target.name==="cancel") {
      setToggleQuiz((state) => !state);
      setToggleHandler(false)
      setSelectedOption([])
    }else { setToggleQuiz((state) => !state);}
   

  };

  const formHandler = async (event) => {
    event.preventDefault();

    const questionInput = questionInputRef.current.value;
    const imageInput = imageInputRef.current.value;
    const rightAnswer = rightAnswerRef.current.value;
    const inputValidation = {
      questionInput: questionInput,
      imageInput,
      propositions,
      rightAnswer,
    };


    const questions = await validateInput(inputValidation);

    console.log(questions);

    if (!questions) {
      return;
    } else {
      if (event.nativeEvent.submitter.name === "another") {
        setQuestions((state) => [...state, questions]);
        dispatch(quizActions.addQuestions({ question: questions }));
        questionInputRef.current.value = "";
        imageInputRef.current.value = "";
        rightAnswerRef.current.value = "";
        setImageUrl(false);
        setCounter(0);
        return;
      } else {
        setQuestions((state) => [...state, questions]);
        dispatch(quizActions.addQuestions({ question: questions }));
        setToggleHandler((state) => !state);
      }
    }
  };
  const createQuizHandler = async (event) => {
    event.preventDefault();
    const subjectInput = subjectRef.current.value;

    const finalQuiz = await validateQuiz();

    if (!finalQuiz) {
    } else {
      const quiz = {
        subject: subjectInput,
        userNickname: selectedOption.map((item) => item["value"]),
        questions: questions,
      };
      dispatch(createQuiz(quiz))
      setToggleQuiz((state) => !state);
      setToggleHandler(false)
      setSelectedOption([])
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes["left-container"]}>
        <div>
          <p>Validate developers coding skills by creating a quiz !</p>
          {!toggleQuiz && (
            <button className={classes.button} onClick={toggleContainer} name="start">
              Start
            </button>
          )}
          {toggleQuiz && (
            <button className={classes.button} onClick={toggleContainer} name="cancel">
              Cancel
            </button>
          )}
        </div>
      </div>

      {toggleQuiz && (
        <div className={classes["right-container"]}>
          {!toggleHandler && (
            <form className={classes.form} onSubmit={formHandler}>
              <label htmlFor="question">Question 1 of the quiz</label>
              <input
                name="question"
                type="text"
                className={classes.subject}
                placeholder="Question must not be empty"
                ref={questionInputRef}
              />
              {!questionIsValid && (
                <p className={classes.error}>Question must be valid</p>
              )}
              <p>Propostions of the question*</p>
              <div className={classes.propositions}>
                {[...Array(counter)].map((item, index) => {
                  return (
                    <input
                      key={index}
                      name="prop"
                      id="prop"
                      type="text"
                      className={classes.proposition}
                      placeholder=""
                      onChange={(e) => handleChange(e, index)}
                    />
                  );
                })}
                {counter < 5 && <BsPlusLg onClick={addCounter} />}
              </div>
              <label htmlFor="image">Image of the question*</label>
              <input
                name="image"
                id="image"
                type="text"
                className={classes.subject}
                placeholder=".jpeg, .jpg , .gif , .png"
                ref={imageInputRef}
                onChange={(event) => {
                  setImageUrl(event.target.value);
                }}
              />
              {!imageIsValid && (
                <p className={classes.error}>ImageUrl must be valid</p>
              )}
              {imageUrl && (
                <div
                  className={classes.textHover}
                  style={{ display: "block" }}
                  href="#"
                >
                  Hover here to see Image
                  <div>
                    <img
                      className={classes.imageQuiz}
                      src={imageUrl}
                      alt="hover"
                    />
                  </div>
                </div>
              )}

              <label htmlFor="answer">Right answer </label>
              <input
                id="answer"
                name="answer"
                type="text"
                className={classes.subject}
                placeholder="Answer must not be empty"
                ref={rightAnswerRef}
              />
              {!rightAnswerIsValid && (
                <p className={classes.error}>Answer must be valid</p>
              )}

              <button name="done" id="done" className={classes.button}>
                Done
              </button>
              <button className={classes.button} name="another" id="another">
                Another Question
              </button>
            </form>
          )}
          {toggleHandler && (
            <form className={classes.form} onSubmit={createQuizHandler}>
              <label htmlFor="subject">Subject of the quiz</label>
              <input
                name="subject"
                type="text"
                className={classes.subject}
                placeholder="Subject must not be empty"
                ref={subjectRef}
              />
              {!subjectIsValid && (
                <p className={classes.error}>Subject must be valid</p>
              )}
              <label htmlFor="users">
                Select users concerned about this quiz
              </label>
              <Select
                defaultValue={selectedOption}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                onChange={setSelectedOption}
                options={users}
                name="users"
                id="users"
                className={classes.subject}
              />
              {!userSelect && (
                <p className={classes.error}>Select at least one user</p>
              )}
              <button className={classes.button} name="create" id="create">
                Create Quiz
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
