import axios from "axios";
import { BASE_URL_API } from "../../../configs/constants";

export const getCountries = () => async (dispatch) => {
  try {
    const response = await axios.get(`${BASE_URL_API}countries`);

    dispatch({ type: "FETCH_COUNTRIES", payload: response.data.data });
  } catch (err) {
    if (err.response) {
      console.log(err.response);
      return err.response.data.message;
    }
    console.log(err);
    return "Something went wrong!";
  }
};
