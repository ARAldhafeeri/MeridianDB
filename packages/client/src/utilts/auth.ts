import { api } from "../api/index";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const setAuthToken = (token: string) => {
  if (token) {
    Cookies.set("token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    Cookies.remove("token");
  }
};

export const setCurrentUser = (token: string) => {
  const user = token ? jwtDecode(token) : null;
  // TODO : Zustand client state.
};
