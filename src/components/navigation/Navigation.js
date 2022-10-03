import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal";
import {MdCircleNotifications} from "react-icons/md"
import {RiLogoutBoxRLine} from "react-icons/ri"
import classes from "./Navigation.module.css";
import { authActions } from "../../store/auth";
import { Link } from "react-router-dom";
import icon from '../../images/code.ico'


const Navigation = (props) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const signIn = () => {
    dispatch(modalActions.signIn());
  };
  const signUp = () => {
    dispatch(modalActions.signUp());
  };

  const logout = () => {
    dispatch(authActions.logout())
  }

  return (
    <header className={classes.header}>
      <div className={classes.logo}>#CodingIsAnArt <img src={icon} alt="icon"/></div>
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
          <nav >
            <div className={classes.dropdown}>
            <button className={classes.dropbtn}><MdCircleNotifications className={classes.icon}/></button>
            <div className={classes['dropdown-content']}>
              <Link to="/user-profile">My Profile</Link>
              <Link to="/quiz">Quiz</Link>
            </div>
            </div>
            <button className={classes.logout} onClick={logout}><RiLogoutBoxRLine className={classes.icon}/></button>
          </nav>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
