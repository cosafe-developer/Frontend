/* import Cookies from "universal-cookie";


const handleLogin = (token, data) => {
  const cookies = new Cookies();

  //? Save token expiration date (30 days)
  let date = new Date();
  date.setDate(date.getDate() + 30);
  let dateInt = date.getTime();
  cookies.set("token-exp-date", dateInt, { path: "/", expires: new Date(dateInt) });

  //? Save token on cookies. Secure if on production.
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    cookies.set("token", token, { path: "/", expires: new Date(dateInt) });
    cookies.set("persona_id", data.id || "", { path: "/", expires: new Date(dateInt) });
  } else {
    cookies.set("token", token, { path: "/", expires: new Date(dateInt) });
    cookies.set("persona_id", data.id || "", { path: "/", expires: new Date(dateInt) });
  }
  const userInfo = {
    name: data.name,
    username: data.username,
    email: data.email,
  };

  //? Save data on localstorage
  localStorage.setItem("userInfo", JSON.stringify(userInfo));

  if (data?.userRole) {
    localStorage.setItem("role", data?.userRole);
  }
};

export { handleLogin as default }; */