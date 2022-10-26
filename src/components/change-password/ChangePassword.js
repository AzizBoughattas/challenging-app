import axios from "axios";
import { Fragment, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { uiActions } from "../../store/ui-actions";
import classes from ".//ChangePassword.module.css";

const ChangePassword = () => {
  let { token } = useParams();
  const passwordRef = useRef();
  const [error, setError] = useState(false);
  const [successHandler, setSuccessHandler] = useState(false);
  const dispatch = useDispatch();

  const changePasswordHandler = () => {
    const password = passwordRef.current.value;
    if (password.trim().length >= 5) {
      setError(false);
      dispatch(
        uiActions.showNotification({
          status: "loading",
          title: "Loading!",
          message: "isLoading",
        })
      );
      axios
        .post(`http://localhost:8080/api/users/new-password/${token}`, {
          password: password,
        })
        .then((res) => {
          dispatch(
            uiActions.showNotification({
              status: "success",
              title: "Change succeeded",
              message: "You can now use your new password",
            })
          );
          setSuccessHandler(true);
          setTimeout(() => {
            dispatch(uiActions.hideNotification());
          }, 4000);
        })
        .catch((error) => {
          if (error.response.data) {
            dispatch(
              uiActions.showNotification({
                status: "error",
                title: "Error!",
                message: error.response.data,
              })
            );
            setError(true);
          } else {
            dispatch(
              uiActions.showNotification({
                message: "An Error has Occured please try later",
                title: "Error!",
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
      <div className={classes.titre}>
        <h2>
          {!successHandler
            ? " Enter your new Password"
            : "Well done your password has changed successfully !"}
        </h2>
      </div>
      {!successHandler && (
        <Fragment>
          <div>
            <input
              style={{ border: error ? "red 2px solid" : "" }}
              className={classes.input}
              type="password"
              placeholder="Enter Your new Password Here"
              id="password"
              ref={passwordRef}
            />
          </div>
          <button className={classes.button} onClick={changePasswordHandler}>
            Change My password
          </button>
        </Fragment>
      )}
    </div>
  );
};

export default ChangePassword;
