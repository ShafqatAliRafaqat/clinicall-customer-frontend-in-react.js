import axios from "../configs/axios";
import moment from "moment";
import Geocode from "react-geocode";

export const spacesBetween = (txt) => {
  return (
    txt
      // insert a space before all caps
      .replace(/([A-Z])/g, " $1")
      // uppercase the first character
      .replace(/^./, (str) => str.toUpperCase())
  );
};

export const strBetweenDoubleQuots = (msg) =>
  msg.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// export const toTitleCase = phrase => {
//   return phrase !== undefined && _.startCase(_.toLower(phrase));
// };

export const pause = (duration) => {
  const start = Date.now();
  while (Date.now() - start < duration) { }
};

export const sleep = (duration) => pause(duration);

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const emailValidate = (email) => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.trim());
};

export const passwordValidate = (pwd) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  const isValid = new RegExp(regex).test(pwd.trim());

  return isValid;
};

export const validate = (key = "email", val) => {
  if (key.toLowerCase() === "email") {
    return emailValidate(val);
  } else if (key.toLowerCase() === "password") {
    return passwordValidate(val);
  }
};

export const phoneValidate = (number) => {
  number = number.replace("-", "");
  number = number.replace("+", "");
  number = number.replace("92", "0");
  if (number.length === 11) return true;
  return false;
};

export const convertPhone = (number) => {
  number = number.replace("-", "");
  number = number.replace("+", "");
  number = number.replace("92", "0");
  if (number.length === 11) return number.trim();
  return false;
};

export const validateLength = (val, len = 3) => val.length >= len;

export const getAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    return false;
  }

  // await store.dispatch(updateAccessTokenAction(refreshToken));
  // return store.getState().login.accessToken;
};

/**
 * method =   is type of action i.e get, post put patch delete
 * endPoint = is the url of the end point
 * data =     is data to send with the request
 * token =    access token to get access to that end point
 * headers =  extra headers if provided
 */
export const apiCall = (method, endPoint, data, token, headers = {}) => {
  if (method.toLowerCase() === "post" || method.toLowerCase() === "patch") {
    return axios[method](endPoint, data, {
      headers: authHeader(token, headers),
    });
  }
  return axios[method](endPoint, { headers: authHeader(token, headers) });
};

export const authHeader = (token, rest) => {
  return { ...rest, authorization: `Bearer ${token}` };
};

export const Capitalize = (str) => {
  if (!str) {
    return;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const autoCompleteValue = (e) => {
  return e.currentTarget.innerText;
};

export const formatTime = (time) => {
  return moment(time).format("HH:mm a");
};
export const sendDateFormat = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

export const filterUrl = (filterArray) => {
  let url = '';
  filterArray.map(item => {
    if (item.type === 'select') {
      if(item.value.value){
        url = url.concat(`${item.name}=${item.value.value}&`)
      }
    }
    else if (item.value) {
      url = url.concat(`${item.name}=${item.value}&`)
    }
  })
  return url;
}
