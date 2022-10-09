import Card from "./Card";
import classes from "./Modal.module.css";
import Button from "./Button";
import ReactDOM from "react-dom";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth";
import { useHistory } from "react-router-dom";
import { modalActions } from "../../store/modal";
import { sendCordinate } from "../../store/auth-actions";

var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const Backdrop = (props) => {
  const dispatch = useDispatch();

  const hideModal = () => {
    dispatch(modalActions.closeModal());
  };
  return <div className={classes.backdrop} onClick={hideModal} />;
};

const ModalOverlay = (props) => {
  const [checkInput, setCheckInput] = useState(true);
  const emailInput = useRef();
  const passwordInput = useRef();
  const nicknameInput = useRef();
  const dispatch = useDispatch();
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

    setCheckInput(
      emailInput.current.value.match(validRegex) &&
        passwordInput.current.value.trim().length >= 6 &&
        passwordInput.current.value.length > 5
    );

    if (checkInput) {
      props.myInput(
        emailInput.current.value,
        passwordInput.current.value,
        nicknameInput.current.value
      );
      dispatch(
        sendCordinate({
          email: emailInput.current.value,
          password: passwordInput.current.value,
          nickname:nicknameInput.current.value
        })
      );
      // dispatch(authActions.login());
      // dispatch(modalActions.closeModal());
      // navigate.replace("/");
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
          <input
            type="text"
            required
            name="nickname"
            placeholder="Nickname"
            ref={nicknameInput}
            className={classes.input}
          />
          <input
            type="email"
            required
            name="email"
            placeholder="Email"
            ref={emailInput}
            className={classes.input}
          />
          <input
            type="password"
            required
            name="password"
            placeholder="Password"
            ref={passwordInput}
            className={classes.input}
          />
        </div>
        {!checkInput && <p>fama mochkl</p>}
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
