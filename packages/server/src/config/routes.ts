const apiBase = (path: string) => `/api/${path}`;

export const ROOT_ROUTE = "/";
export const ID_ROUTE = "/:id";
export const BULK_ROUTE = "/bulk"

export const ENDPOINTS = {
  login: apiBase("login"), // login super admin
  init: apiBase("init"), // init schema or get status of initialized schema
  health: apiBase("health"), // health status
  // core entities
  orgs: apiBase("orgs"),
  admins: apiBase("admins"),
  agents: apiBase("agents"),
  memories: apiBase("memories"),
};
