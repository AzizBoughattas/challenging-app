import axios from "axios";
import { authActions } from "./auth";
import { modalActions } from "./modal";
import { uiActions } from "./ui-actions";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const calculateRemainingTime = () => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date().getTime() + 10800000;

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
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

      // dispatch(
      //   uiActions.showNotification({
      //     status: "success",
      //     title: "Success!",
      //     message: "sent cart data successfully",
      //   })
      // );
    } catch (error) {
      // dispatch(
      //   uiActions.showNotification({
      //     status: "error",
      //     title: "Error!",
      //     message: "Sending cart data failed!",
      //   })
      // );
      console.log("alo");
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

      // dispatch(
      //   uiActions.showNotification({
      //     status: "success",
      //     title: "Success!",
      //     message: "sent cart data successfully",
      //   })
      // );
    } catch (error) {
      if (error.response.data) {
        dispatch(
          uiActions.showErrorNotification({
            message: error.response.data,
            show: true,
          })
        );
      } else {
        dispatch(
          uiActions.showErrorNotification({
            message: "An Error has Occured please try later",
            show: true,
          })
        );
      }
    }
  };
};
