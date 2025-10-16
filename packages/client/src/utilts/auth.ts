import { jwtDecode } from "jwt-decode";

export const setCurrentUser = (token: string) => {
  const user = token ? jwtDecode(token) : null;
  // TODO : Zustand client state.
};
