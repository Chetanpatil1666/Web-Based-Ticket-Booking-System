import Cookies from "js-cookie";
import {
  AUTH_LOG_IN_SUCCESS,
  AUTH_LOG_IN_ERROR,
  AUTH_LOG_OUT,
} from "./auth.types";

export const authInitalState = {
  loading: false,
  data: {
    token: Cookies.get("jwttoken") || "",
    userid: Cookies.get("userid") || "",
    isAuthenticated: !!Cookies.get("jwttoken"),
  },
  error: false,
};

export const authReducer = (state = authInitalState, { type, payload }) => {
  switch (type) {
    case AUTH_LOG_IN_SUCCESS: {
      // console.log("logged in successfully");
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          token: Cookies.get("jwttoken"),
          userid: Cookies.get("userid"),
          isAuthenticated: true,
        },
      };
    }
    case AUTH_LOG_IN_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }
    case AUTH_LOG_OUT: {
      Cookies.remove("jwttoken");
      Cookies.remove("userid");
      Cookies.remove("usergender");
      return {
        ...state,
        data: {
          ...state.data,
          token: "",
          role: "",
          userid: "",
          isAuthenticated: false,
        },
      };
    }
    default: {
      return state;
    }
  }
};
