import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal";
import { MdCircleNotifications } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import classes from "./Navigation.module.css";
import { authActions } from "../../store/auth";
import { Link } from "react-router-dom";
import icon from "../../images/code.ico";
import axios from "axios";

const Navigation = (props) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const [quizNumber,setQuizNumber] = useState(0)
  useEffect(() => {
    if(isAuthenticated) {
     axios.get('http://localhost:8080/api/users/me').then((res)=> {
      setQuizNumber(res.data.quiz.length)
     })
    }
  })

  const signIn = () => {
    dispatch(modalActions.signIn());
  };
  const signUp = () => {
    dispatch(modalActions.signUp());
  };

  const logout = () => {
    dispatch(authActions.logout());
  };

  return (
    <header className={classes.header}>
      <Link to="/" className={classes.logo}>
        #CodingIsAnArt <img src={icon} alt="icon" />
      </Link>
      <nav>
        {!isAuthenticated ? (
          <ul>
            <li>
              <p onClick={signIn}>Sign in</p>
            </li>
            <li>
              <p onClick={signUp}>Sign up</p>
            </li>
          </ul>
        ) : (
          <nav>
            <div className={classes.dropdown}>
              <button className={classes.dropbtn}>
                <MdCircleNotifications className={classes.icon} />
                <span className={classes.badge}>{quizNumber}</span>
              </button>
              <div className={classes["dropdown-content"]}>
                <Link to="/user-profile">My Profile</Link>
                <Link to="/quiz" className={quizNumber===0? classes["disabled-link"] : ""}>
                  Quiz <span className={classes.notif}>{quizNumber}</span>
                </Link>
                {isAdmin && <Link to="/admin">Create Quiz</Link>}
              </div>
            </div>
            <button className={classes.logout} onClick={logout}>
              <RiLogoutBoxRLine className={classes.icon} />
            </button>
          </nav>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
