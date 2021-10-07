import { combineReducers } from "redux";
import countriesReducer from "./countries/";
import citiesReducer from "./cities/";
import emailReducer from "./email/";
import chatReducer from "./chat/";
import todoReducer from "./todo/";
import customizer from "./customizer/";
import auth from "./auth/";
import navbar from "./navbar/Index";
import dataList from "./data-list/";
import flashMessages from "./flashMessages";

const rootReducer = combineReducers({
  countries: countriesReducer,
  cities: citiesReducer,
  emailApp: emailReducer,
  todoApp: todoReducer,
  chatApp: chatReducer,
  customizer: customizer,
  auth: auth,
  navbar: navbar,
  dataList: dataList,
  flashMessages: flashMessages,
});

export default rootReducer;
