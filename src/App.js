import axios from "axios";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Admin from "./components/admin/Admin";
import ChangePassword from "./components/change-password/ChangePassword";
import ForgetPassword from "./components/forget-password/ForgetPassword";
import Home from "./components/home/Home";
import Layout from "./components/navigation/Layout";
import Profile from "./components/profile/Profile";
import Quiz from "./components/quiz/Quiz";
import Modal from "./components/UI/Modal";
import Notification from "./components/UI/Notification";
import { authActions } from "./store/auth";

function App() {
  const modal = useSelector((state) => state.modal.modalShow);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const notification = useSelector((state) => state.ui.notification);
  const dispatch = useDispatch();
  axios.defaults.headers.common["Authorization"] = token;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  useEffect(() => {
    const calculateRemainingTime = () => {
      const currentTime = new Date().getTime();
      const adjExpirationTime = new Date().getTime() + 10800000;
    
      const remainingDuration = adjExpirationTime - currentTime;
    
      return remainingDuration;
    };
    if (isAuthenticated) {
      setTimeout(() => {
        dispatch(authActions.logout());
        console.log("logout");
      }, 10800000);
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          message={notification.message}
          title={notification.title}
        />
      )}
      <Switch>
        <Route path="/" exact>
          <Layout>
            <main>
              <Home />
            </main>
          </Layout>
        </Route>
        {isAuthenticated && (
          <Route path="/user-profile">
            <Layout>
              <main>
                <Profile />
              </main>
            </Layout>
          </Route>
        )}
        {isAuthenticated && (
          <Route path="/quiz">
            <Layout>
              <main>
                <Quiz />
              </main>
            </Layout>
          </Route>
        )}
        {isAdmin && (
          <Route path="/admin">
            <Layout>
              <main>
                <Admin notification={notification} />
              </main>
            </Layout>
          </Route>
        )}

          <Route path="/reset-password/:token">
            <Layout>
              <main>
                <ChangePassword />
              </main>
            </Layout>
          </Route>

        <Route path="/forget-password">
          <Layout>
            <main>
              <ForgetPassword />
            </main>
          </Layout>
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>

      {modal && <Modal />}
    </Fragment>
  );
}

export default App;
