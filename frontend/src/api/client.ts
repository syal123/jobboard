// The single shared connection every page in app uses to talk to the backend, instead of each page setting
// up its own. Two thing happen here, invisible to whichever page is calling it: the login token gets attached
// to every request, and a request that gets no response at all (likely a cold-starting backend) is silently
// retired a few times.

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

// Runs after every request. If a request fails with litreally no response, wait for few seconds and try the 
// exact same request again, up to 3 times, before finally giving up and showing an error.
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
