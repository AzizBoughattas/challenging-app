import React from "react";
import classes from "./Home.module.css";
import coding from "../../images/coding.jpg";
import { useSelector } from "react-redux";

const Home = () => {
    const isAuthenticated = useSelector(state=>state.auth.isAuthenticated)
  return (
    <React.Fragment>
      <div className={classes.container}>
        <img src={coding} alt="backgroundImage" className={classes.background}/>
        <div className={classes.text}>
          {!isAuthenticated &&<h1>
            Are you Ready to <span>Code</span> ?
          </h1>}
          {isAuthenticated &&<h1>
            hi <span>Code</span> ?
          </h1>}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
