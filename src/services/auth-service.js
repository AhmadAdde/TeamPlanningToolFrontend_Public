import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  signIn(username, password) {
    return axios
      .post(API_URL + "sign-in", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.accessToken !== null) {
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("jwt", response.data.accessToken);
          console.log("From auth-service: " + localStorage.getItem("user"));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    console.log("Logout");
  }

  signUp(username, fullName, password, age) {
    return axios
      .post(API_URL + "sign-up", {
        username,
        fullName,
        password,
        age,
      })
      .then((response) => {
        if (response.status !== 201) return response.message;
        return response;
      });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
