import env from "configs/env.config";

const baseURL = env.API_URL;

/**
 * Fetch sin token, solo usando cookies (sesiones)
 */
const fetchWithoutCookies = (endpoint, data, method = "GET") => {
  const url = `${baseURL}/${endpoint}`;

  const options = {
    method,
  };

  if (method !== "GET") {
    options.headers = {
      "Content-Type": "application/json",
    };
    options.body = JSON.stringify(data);
  }

  return fetch(url, options);
};

const fetchWithCookies = (endpoint, data = {}, method = "GET") => {
  const url = `${baseURL}/${endpoint}`;

  const options = {
    method,
    credentials: "include",
    headers: {},
  };

  if (method !== "GET" && method !== "DELETE") {
    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data ?? {});
    }
  }

  return fetch(url, options);
};




export {
  fetchWithoutCookies,
  fetchWithCookies,
};
