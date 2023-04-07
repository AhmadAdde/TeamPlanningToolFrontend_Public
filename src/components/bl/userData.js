import axios from "axios";

const API_URL = "http://localhost:8080/api/data";
const jwt = localStorage.getItem("jwt");

const Headers = {
  Authorization: "Bearer " + jwt,
  "Content-Type": "application/json",
};

class FetchUserData {
  getUserGreeting() {
    return axios
      .get(API_URL + "/get?username=" + localStorage.getItem("username"), {
        headers: Headers,
      })
      .then((response) => {
        return response.data;
      });
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new FetchUserData();
