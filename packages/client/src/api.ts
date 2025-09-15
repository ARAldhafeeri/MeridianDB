// Determine if we're in development or production
const isDevelopment = import.meta.env.DEV;

// Base URL configuration
export const API_BASE_URL = isDevelopment
  ? "http://localhost:8787" // Direct to Hono server in dev
  : ""; // Relative paths in production (SSR)

// Smart fetch function
export const apiFetch = (endpoint: string, options?: RequestInit) => {
  const url = `${API_BASE_URL}${endpoint}`;
  return fetch(url, {
    ...options,
    credentials: "include", // Include cookies if needed
  });
};

export const queryFetcher = async ({ queryKey }: { queryKey: any[] }) => {
  const [endpoint] = queryKey;
  const response = await apiFetch(endpoint);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
