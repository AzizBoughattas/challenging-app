import axios from "axios";

const config = {headers: {
  'Content-Type' : 'application/json'
}}

export const sendCordinate = (data) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      axios
        .post("http://localhost:8080/api/users", data,config)
        .then((res) => {
          console.log(res)
          console.log(res.headers);
          console.log(res.data);
        })
        .catch((e) => {
          // let errorMessage = 'Authentication failed'
          // if(e && e.error && e.error.message) {
          //   errorMessage = data.error.message
          // }
            console.log(e)
        }); 
      }

    try {
      const response = await sendRequest()

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
      console.log(error.message);
    }
  };
};
