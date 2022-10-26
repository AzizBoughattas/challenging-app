import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import { uiActions } from "../../store/ui-actions";
import classes from "./ForgetPassword.module.css";

var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const ForgetPassword = () => {
  const emailInputRef = useRef();
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const requestChangePassword = () => {
    let email = emailInputRef.current.value;
    if (email.match(validRegex)) {
      setError(false);
      dispatch(
        uiActions.showNotification({
          status: "loading",
          title: "Loading!",
          message: "isLoading",
        })
      );
      axios
        .post("http://localhost:8080/api/users/reset",{email:email})
        .then((res) => {
          dispatch(authActions.changePasswordTokenHandler({ token: res.data }));
          dispatch(
            uiActions.showNotification({
              status: "success",
              title: "You re almost there !",
              message: "Please check your email to continue",
            })
          );
          setTimeout(() => {
            dispatch(uiActions.hideNotification())
          }, 2000)
        })
        .catch((error) => {
          if (error.response.data) {
            dispatch(
              uiActions.showNotification({
                status: "error",
                title:"Error!",
                message: error.response.data,
              })
            );
            setError(true);
          } else {
            dispatch(
              uiActions.showNotification({
                message: "An Error has Occured please try later",
                title:"Error!",
                status: "error",
              })
            );
            setError(true);
          }
        });
    } else {
      setError(true);
    }
  };
  return (
    <div className={classes.container}>
      <div>
        <div className={classes.titre}>
          <h2>Forgot your password?</h2>
          <p>
            Change your password in three easy steps. This will help you to
            secure your password!
          </p>
          <ol className={classes.list}>
            <li>
              <span>1. </span>Enter your email address below.
            </li>
            <li>
              <span>2. </span>Our system will send you a temporary link to your
              email
            </li>
            <li>
              <span>3. </span>Use the link to reset your password
            </li>
          </ol>
        </div>
        <div>
          <input
            style={{ border: error ? "red 2px solid" : "" }}
            className={classes.input}
            type="email"
            placeholder="Enter Your Email Here"
            id="email"
            ref={emailInputRef}
          />
        </div>
        <button className={classes.button} onClick={requestChangePassword}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;
