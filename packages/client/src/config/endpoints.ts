const apiBase = (path: string) => `/api/${path}`;

// const ROOT_ROUTE = "/";
// const ID_ROUTE = "/:id";
// const BULK_ROUTE = "/bulk";

// // memories agent-admin portal split specific endpoints
// const AGENT_SEARCH_SINGLE = "/search/single";
// const AGENT_SEARCH_MULTI = "/search/multi";
// const AGENT_MEMORY_BEHAVIORAL = "/behavioral";

const ENDPOINTS = {
  auth: apiBase("auth"), // login super admin
  init: apiBase("init"), // init schema or get status of initialized schema
  health: apiBase("health"), // health status
  // core entities
  orgs: apiBase("orgs"),
  admins: apiBase("admins"),
  agents: apiBase("agents"),
  memoriesAgent: apiBase("memories/agent"),
  memoriesAdmin: apiBase("memories/admin"),
};

export const AUTH_ENDPOINTS = {
  login: "/login",
  init: "/init",
  logout: "/logout",
  agent: {
    access: "/agents/access",
    refresh: "/agents/refresh",
  },
};

// auth endpoints
export const LOGIN_ENDPOINT = ENDPOINTS.auth + AUTH_ENDPOINTS.login;
export const INIT_SUPER_ADMIN_ENDPOINT = ENDPOINTS.auth + AUTH_ENDPOINTS.init;
export const LOGOUT_ENDPOINT = ENDPOINTS.auth + AUTH_ENDPOINTS.logout;
