import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// The backend can take a few seconds to wake up if it's been idle (cold start).
// A request that lands during that window fails with no response from the server
// at all (a network-level error, not a real 4xx/5xx from the app). In that specific
// case, silently retry a couple of times with a short delay instead of surfacing
// an error immediately - real application errors (wrong password, validation, etc.)
// always have a response and are never retried here.
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 4000;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as (typeof error.config & { __retryCount?: number }) | undefined;

    if (!config || error.response) {
      return Promise.reject(error);
    }

    config.__retryCount = (config.__retryCount ?? 0) + 1;

    if (config.__retryCount > MAX_RETRIES) {
      return Promise.reject(error);
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    return apiClient(config);
  }
);

export default apiClient;
