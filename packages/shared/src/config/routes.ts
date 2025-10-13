const apiBase = (path: string) => `/api/${path}`;

export const ROOT_ROUTE = "/";
export const ID_ROUTE = "/:id";
export const BULK_ROUTE = "/bulk";

// memories agent-admin portal split specific endpoints
export const AGENT_SEARCH_SINGLE = "/search/single";
export const AGENT_SEARCH_MULTI = "/search/multi";
export const AGENT_MEMORY_BEHAVIORAL = "/behavioral";

export const ENDPOINTS = {
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
  agent: {
    access: "/agents/access",
    refresh: "/agents/refresh",
  },
};
