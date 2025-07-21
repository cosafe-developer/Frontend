const ENV = import.meta.env;

const env = {
  MODE: ENV.MODE,
  API_URL: ENV.VITE_API_URL,
  APP_URL: ENV.VITE_APP_URL,
};

export default env;