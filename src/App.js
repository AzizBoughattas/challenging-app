import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import Home from "./components/home/Home";
import Layout from "./components/navigation/Layout";
import Profile from "./components/profile/Profile";
import Quiz from "./components/quiz/Quiz";
import Modal from "./components/UI/Modal";

function App() {
  const modal = useSelector((state) => state.modal.modalShow);
  const [data,setData] = useState({})

  const myInput = (email,password) => {
    console.log(email)
    setData({password:password,email:email})
  }

  return (
    <Fragment>
      <Route path="/" exact>
      <Layout>
          <main>
            <Home />
          </main>
        </Layout>
      </Route>
      {<Route path="/user-profile" exact>
      <Layout>
          <main>
            <Profile data={data}/>
          </main>
        </Layout>
      </Route>}
      {<Route path="/quiz" exact>
      <Layout>
          <main>
            <Quiz />
          </main>
        </Layout>
      </Route>}
      {modal && <Modal myInput={myInput}/>}
    </Fragment>
  );
}

export default App;
