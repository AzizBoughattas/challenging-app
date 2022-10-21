import axios from "axios";
import { uiActions } from "./ui-actions";

export const createQuiz = (data) => {
  return async (dispatch) => {

    console.log(data);
    const sendRequest = async () => {
      return axios.post("http://localhost:8080/api/quiz/create", data);
    };

    try {
      dispatch(
        uiActions.showNotification({
          status: "loading",
          title: "Loading!",
          message: "isLoading",
        })
      );
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Sent quiz data successfully",
        })
      );
       setTimeout(() => {
        dispatch(uiActions.hideNotification())
      }, 2000)
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Storing data failed .. try Again",
        })
      );
    }

    //   try {
    //     const response = await sendRequest();
    //     dispatch(authActions.login({ data: response.data }));
    //     dispatch(modalActions.closeModal());

    //     // dispatch(
    //     //   uiActions.showNotification({
    //     //     status: "success",
    //     //     title: "Success!",
    //     //     message: "sent cart data successfully",
    //     //   })
    //     // );
    //   } catch (error) {
    //     if (error.response.data) {
    //       dispatch(
    //         uiActions.showErrorNotification({
    //           message: error.response.data,
    //           show: true,
    //         })
    //       );
    //     } else {
    //       dispatch(
    //         uiActions.showErrorNotification({
    //           message: "An Error has Occured please try later",
    //           show: true,
    //         })
    //       );
    //     }
    //   }
  };
};

export const quizAnswers = (data) => {
    return async (dispatch) => {
      console.log(data);
      const sendRequest = async () => {
        return axios.post("http://localhost:8080/api/quiz/answer", data);
      };

      try {
        dispatch(
          uiActions.showNotification({
            status: "loading",
            title: "Loading!",
            message: "isLoading",
          })
        );
        await sendRequest();
        dispatch(
          uiActions.showNotification({
            status: "success",
            title: "Success!",
            message: "your answers are sent successfully",
          })
        );
         setTimeout(() => {
          dispatch(uiActions.hideNotification())
        }, 2000)
      } catch (error) {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error",
            message: "failed sending your answers",
          })
        );
        setTimeout(() => {
          dispatch(uiActions.hideNotification())
        }, 2000)
      }
    }
}
