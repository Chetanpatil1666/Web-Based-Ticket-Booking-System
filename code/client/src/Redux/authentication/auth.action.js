import {
  AUTH_LOG_IN_SUCCESS,
  AUTH_LOG_IN_ERROR,
  AUTH_LOG_OUT,
} from "./auth.types";
import axios from "axios";
import Cookies from "js-cookie";
import { error, success } from "../../Utils/notification";
import { API_BASE_URL } from "../../config/api";

export const loginAPI = (data, navigate) => async (dispatch) => {
  try {
    let response = await axios.post(`${API_BASE_URL}/user/login`, data);
    // console.log(response);
    if (response.data.status === "Failed") {
      error(response.data.message);
    } else {
      Cookies.set("jwttoken", response.data.message.token, { expires: 7 });
      Cookies.set("userid", response.data.message.user._id, { expires: 7 });
      Cookies.set("usergender", response.data.message.user.gender || "male", { expires: 7 });
      dispatch({
        type: AUTH_LOG_IN_SUCCESS,
        payload: response.data,
      });
      success("Signed In successfully");
    }
  } catch (error) {
    dispatch({
      type: AUTH_LOG_IN_ERROR,
    });
    console.log(error);
  }
};

export const logoutAPI = () => ({ type: AUTH_LOG_OUT });

