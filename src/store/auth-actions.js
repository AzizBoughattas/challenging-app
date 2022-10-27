import axios from "axios";
import { authActions } from "./auth";
import { modalActions } from "./modal";
import { uiActions } from "./ui-actions";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};



export const Register = (data) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      return axios.post("http://localhost:8080/api/users", data, config);
    };

    try {
      const response = await sendRequest();
      dispatch(authActions.login({ data: response.data }));
      dispatch(modalActions.closeModal());

      console.log(response);
    } catch (error) {
      if (error.response.data) {
        dispatch(
          uiActions.errorAuth({
            status:"error",
            message:error.response.data
          })
        );
      } else {
        dispatch(
          uiActions.errorAuth({
            message: "An Error has Occured please try later",
            status:"error",
          })
        );
      }
    }
  };
};
export const LoggingIn = (data) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      return axios.post("http://localhost:8080/api/auth", data, config);
    };

    try {
      const response = await sendRequest();
      dispatch(authActions.login({ data: response.data }));
      dispatch(modalActions.closeModal());

    } catch (error) {
      if (error.response.data) {
        dispatch(
          uiActions.errorAuth({
            status:"error",
            message:error.response.data
          })
        );
      } else {
        dispatch(
          uiActions.errorAuth({
            message: "An Error has Occured please try later",
            status:"error",
          })
        );
      }
    }
  };
};
