import { API } from "../config";

export const signup = user => {
  //console.log(user);
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

export const signin = user => {
  //console.log(user);
  return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      //console.log(response);
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

// authenticate: put token in localstorage
export const authenticate = (data, cb) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    cb();
  }
};

// sign out
// 这个cb为了redirect user
export const signout = cb => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    cb();
    return fetch(`${API}/signout`, {
      method: "GET"
    })
      .then(response => {
        //console.log("signout", response);
      })
      .catch(err => console.log(err));
  }
};

// isAuthenticated: 判断user有没有login
export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    //console.log(window);
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};
