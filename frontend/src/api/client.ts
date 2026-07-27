// The single shared connection every page in app uses to talk to the backend, instead of each page setting
// up its own. Two thing happen here, invisible to whichever page is calling it: the login token gets attached
// to every request, and a request that fails because the backend was cold-starting (either no response at
// all, or a platform-level error page) is silently retried a few times before showing an error to the user.

import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
});

// Runs before every request is sent. If the user is logged in, attached their login token automatically - 
// no page has to remember to do this itself.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 4000;

// Status codes that mean "the platform/server had a problem", not "the request was actually invalid".
// A cold-starting Vercel container that fails to wake up in time returns one of these (its own error
// page), not just a dropped connection - so these need to be retried too, the same as no response at all.
const RETRYABLE_STATUS_CODES = [500, 502, 503, 504];

// Runs after every request. If a request fails with no response at all, OR fails with one of the
// platform-level status codes above (likely a cold-starting backend either way), wait a few seconds and
// try the exact same request again, up to 3 times, before finally giving up and showing an error. Real
// application errors (400 BusinessException, 401 Unauthorized, etc.) are NOT retried - those are shown
// to the user immediately since retrying won't change the outcome.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as (typeof error.config & { __retryCount?: number }) | undefined;

    const hasNoResponse = !error.response;
    const isPlatformError = error.response && RETRYABLE_STATUS_CODES.includes(error.response.status);

    if (!config || (!hasNoResponse && !isPlatformError)) {
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
