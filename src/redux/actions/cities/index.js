import axios from "axios";
import { BASE_URL_API } from "../../../configs/constants";

export const getCities = () => async (dispatch) => {
  try {
    const response = await axios.get(`${BASE_URL_API}countries?name=Pakistan`);

    dispatch({ type: "FETCH_CITIES", payload: response.data.data });
  } catch (err) {
    if (err.response) {
      console.log(err.response);
      return err.response.data.message;
    }
    console.log(err);
    return "Something went wrong!";
  }
};
