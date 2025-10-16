import axios from "axios";
import { ENVIROMENT_VARS, getEnvVar } from "../config/env";

export const api = axios.create({
  baseURL: getEnvVar(ENVIROMENT_VARS.VITE_API_URL),
  withCredentials: true,
});
