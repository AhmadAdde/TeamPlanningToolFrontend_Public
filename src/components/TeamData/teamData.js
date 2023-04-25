import axios from "axios";

const API_URL = "http://localhost:8080/api";
const jwt = localStorage.getItem("jwt");

const Headers = {
  Authorization: "Bearer " + jwt,
  "Content-Type": "application/json",
};

class DataService {
  getPersons() {
    return axios
      .get(API_URL + "/person/get-all", {
        headers: Headers,
      })
      .then((response) => {
        return response.data;
      });
  }
  getTeams() {
    return axios(API_URL + "/team/get-all", {
      headers: Headers,
      
    })
    .then((response) => {
      return response.data;
    });
  }
  saveDataTeams(saveData) {
    console.log("SAVEGDDASDA", saveData);
    return fetch(API_URL + "/team/create", {
        headers: Headers,
        method: "POST",
        body: JSON.stringify(saveData),
      })
      .then((response) => {
        return response;
      });
  }
  deleteTeam(teamNames) {
    return fetch(API_URL + "/team/delete", {
      headers: Headers,
      method: "POST",
      body: JSON.stringify(teamNames)
    }).then((response) => {
      return response;
    });
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new DataService();
