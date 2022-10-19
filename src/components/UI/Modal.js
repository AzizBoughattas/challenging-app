import Card from "./Card";
import classes from "./Modal.module.css";
import Button from "./Button";
import ReactDOM from "react-dom";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { modalActions } from "../../store/modal";
import { LoggingIn, Register } from "../../store/auth-actions";
import { uiActions } from "../../store/ui-actions";

var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const Backdrop = (props) => {
  const dispatch = useDispatch();

  const hideModal = () => {
    dispatch(modalActions.closeModal());
    dispatch(uiActions.hideErrorNotification())
  };
  return <div className={classes.backdrop} onClick={hideModal} />;
};

const ModalOverlay = (props) => {
  const [checkInput, setCheckInput] = useState(true);
  const emailRef = useRef();
  const passwordRef = useRef();
  const nicknameRef = useRef();
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification)


  const googleContent = useSelector(
    (state) => state.modal.modalInfo.googleContent
  );
  const facebookContent = useSelector(
    (state) => state.modal.modalInfo.facebookContent
  );
  const status = useSelector((state) => state.modal.modalInfo.status);
  const title = useSelector((state) => state.modal.modalInfo.title);
  const navigate = useHistory();

  const formHandler = (event) => {
    event.preventDefault();
    let emailInput = emailRef.current.value;
    let passwordInput = passwordRef.current.value;

    if (status === "Sign in") {
      if (emailInput.match(validRegex) && passwordInput.trim().length >= 6) {
        setCheckInput(true);
        console.log("LoggingIn");
        dispatch(
          LoggingIn({
            email: emailInput,
            password: passwordInput,
          })
        );
        navigate.replace("/");
      } else {
        setCheckInput(false);
      }
    } else {
      let nicknameInput = nicknameRef.current.value;
      if (
        emailInput.match(validRegex) &&
        passwordInput.trim().length >= 6 &&
        nicknameInput.length >= 5
      ) {
        setCheckInput(true);
        console.log("Registering");
        dispatch(
          Register({
            nickname: nicknameInput,
            email: emailInput,
            password: passwordInput,
          })
        );
        navigate.replace("/");
      } else {
        setCheckInput(false);
      }
    }
  };

  return (
    <Card className={classes.modal}>
      <header className={classes.header}>
        <h2>{title}</h2>
      </header>
      <div className={classes.content}>
        <p>{facebookContent}</p>
        <p>{googleContent}</p>
      </div>
      <form onSubmit={formHandler}>
        <div className={classes.inputing}>
          {status === "Sign up" && (
            <input
              type="text"
              required
              name="nickname"
              placeholder="Nickname"
              ref={nicknameRef}
              className={classes.input}
            />
          )}
          <input
            type="email"
            required
            name="email"
            placeholder="Email"
            ref={emailRef}
            className={classes.input}
          />
          <input
            type="password"
            required
            name="password"
            placeholder="Password"
            ref={passwordRef}
            className={classes.input}
          />
        </div>
        {notification && <div className={classes.error}><p>{notification.message}</p></div>}
        <Button type="submit" status={status}></Button>
      </form>
      <footer className={classes.actions}>forget password</footer>
    </Card>
  );
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay myInput={props.myInput} />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
};

export default Modal;
