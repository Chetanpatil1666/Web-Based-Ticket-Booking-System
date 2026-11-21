import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export const Private = ({ children }) => {
  const { pathname, search } = useLocation();
  // console.log("im don", pathname, search);
  let url = pathname + search;
  const token = useSelector((state) => state.auth?.data?.token) || Cookies.get("jwttoken");
  let tokencookies = Cookies.get("jwttoken");
  // console.log("token", token, "cookie", tokencookies);
  if (!token && !tokencookies) {
    return <Navigate to={"/signin"} state={{ from: url }} replace />;
  } else {
    return children;
  }
};
