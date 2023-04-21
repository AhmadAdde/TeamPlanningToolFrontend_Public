import axios from "axios";

const API_URL = "http://localhost:8080/api/data";
const jwt = localStorage.getItem("jwt");

const Headers = {
  Authorization: "Bearer " + jwt,
  "Content-Type": "application/json",
};

class DataService {
  getPersons() {
    return axios
      .get(API_URL + "/get-person-data", {
        headers: Headers,
      })
      .then((response) => {
        return response.data;
      });
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new DataService();
