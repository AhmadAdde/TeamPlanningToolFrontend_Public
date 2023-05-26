import axios from "axios";

const API_URL = "http://localhost:8080/api";
const jwt = localStorage.getItem("jwt");
//const API_URL = "http://localhost:18080/api";

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
  getRoles() {
    return axios
      .get(API_URL + "/team/get-roles", {
        headers: Headers,
      })
      .then((response) => {
        return response.data;
      });
  }
  loadDataToDatabase() {
    return axios
      .get(API_URL + "/team/load-data", {
        headers: Headers,
      })
      .then((response) => {
        return response.data;
      });
  }
  updateDatasources(teamNamesArray) {
    return fetch(API_URL + "/team/update-data", {
      headers: Headers,
      method: "POST",
      body: JSON.stringify(teamNamesArray),
    }).then((response) => {
      return response;
    });
  }
  getTeams() {
    return axios(API_URL + "/team/get-all", {
      headers: Headers,
    }).then((response) => {
      return response.data;
    });
  }
  saveDataTeams(saveData) {
    console.log("SAVEGDDASDA", saveData);
    return fetch(API_URL + "/team/create", {
      headers: Headers,
      method: "POST",
      body: JSON.stringify(saveData),
    }).then((response) => {
      return response;
    });
  }
  deleteTeam(teamNames) {
    return fetch(API_URL + "/team/delete", {
      headers: Headers,
      method: "POST",
      body: JSON.stringify(teamNames),
    }).then((response) => {
      return response;
    });
  }
  deleteSavedData(deletedData) {
    return fetch(API_URL + "/team/deleteSavedData", {
      headers: Headers,
      method: "POST",
      body: JSON.stringify(deletedData.dataTeams),
    }).then((response) => {
      return response;
    });
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new DataService();
