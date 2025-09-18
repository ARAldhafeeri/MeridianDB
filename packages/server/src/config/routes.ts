const apiBase = (path: string) => `/api/${path}`;

export const ENDPOINTS = {
  login: apiBase("login"), // login super admin
  init: apiBase("init"), // init schema or get status of initialized schema
  health: apiBase("health"), // health status endpoint
};
