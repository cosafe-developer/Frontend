import env from "configs/env.config";

const baseURL = env.API_URL;

/**
 * Fetch sin token, solo usando cookies (sesiones)
 */
const fetchWithoutToken = (endpoint, data, method = "GET") => {
  const url = `${baseURL}/${endpoint}`;

  const options = {
    method,
    credentials: "include",
  };

  if (method !== "GET") {
    options.headers = {
      "Content-Type": "application/json",
    };
    options.body = JSON.stringify(data);
  }

  return fetch(url, options);
};

const fetchWithToken = (endpoint, data = {}, method = "GET") => {
  const url = `${baseURL}/${endpoint}`;

  const options = {
    method,
    credentials: "include",
    headers: {},
  };

  if (method !== "GET") {
    options.headers["Content-Type"] = "application/json";

    const safeData = data ?? {};
    options.body = JSON.stringify(safeData);
  }

  return fetch(url, options);
};


const fetchWithOptionalToken = (endpoint, data, method = "GET") => {
  return fetchWithToken(endpoint, data, method);
};

export {
  fetchWithoutToken,
  fetchWithToken,
  fetchWithOptionalToken,
};
