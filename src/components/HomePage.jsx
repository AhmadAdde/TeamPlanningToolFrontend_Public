import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getPersons from "../components/TeamData/teamData";

import classes from "./HomePage.module.css";

import Board from "./Board/Board";

export default function HomePage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [deletedTeams, setDeletedTeams] = useState([]);
  const [dataTeams, setDataTeams] = useState([]);
  const [roles, setRoles] = useState([]);
  const [comparedData, setComparedData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const loadData = await getPersons.loadDataToDatabase();
        console.log("LOADDATA", loadData);
        setComparedData(loadData);
        const userResponse = await getPersons.getPersons();
        setUsers(userResponse);
        console.log("USERRESPONSE: ", userResponse);
        const response = await getPersons.getTeams();
        console.log("TEAMRESPONSE: ", response);
        const rolesResponse = await getPersons.getRoles();
        setRoles(rolesResponse);
        console.log("ROLESRESPONSE: ", rolesResponse);
        const userColumn = { teamName: "Users", userIds: [] };
        for (var i = 0; i < userResponse.length; i++) {
          userColumn.userIds.push(userResponse[i].username);
        }

        response.push(userColumn);

        console.log("Modified Response: ", response);

        const newDataTeams = [];
        console.log("DATABASETEAMRESPONSE", response);
        response.forEach((team) => {
          console.log("Current Team: ", team);

          const transformedTeam = {
            teamName: team.teamName,
            metaData: team.metaData ? Object.values(team.metaData) : [],
            scrumMaster: team.scrumMaster,
            userIds: team.userIds,
          };

          console.log("Transformed Team: ", transformedTeam);
          newDataTeams.push(transformedTeam);
        });

        console.log("DATABASETEAM", newDataTeams);
        setDataTeams(newDataTeams.reverse());
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
    fetchData();
  }, []);

  console.log("USERSBACKEN", users);
  console.log("DATA TEAMS", dataTeams);
  const navigate = useNavigate();
   function addTeamHandler(enteredTeamName) {
    const updatedDataTeams = [
      ...dataTeams,
      { teamName: enteredTeamName, metaData: [], scrumMaster: [], userIds: [] },
    ];
    setDataTeams(updatedDataTeams);
    return updatedDataTeams;
  }
  function deleteTeamHandler(teamName) {
    const newDeletedTeams = [...deletedTeams, teamName];
    setDeletedTeams(newDeletedTeams);

    const updatedDataTeams = dataTeams.filter(
      (team) => team.teamName !== teamName
    );
    console.log("UPDATEDDATATEAMS", updatedDataTeams);
    setDataTeams(updatedDataTeams);
    return updatedDataTeams;
  }

  function handleSaved(savedData) {
    console.log("SAVEDDATA", savedData.dataTeams);
    getPersons
      .saveDataTeams(savedData.dataTeams)
      .catch((response) => console.log(response));
    console.log("savedData", savedData.dataTeams);
    let teamNamesArray = savedData.dataTeams.map((team) => team.teamName);
    console.log("teamNamesArray", teamNamesArray);
    getPersons.updateDatasources(teamNamesArray);
  }

  console.log("DATATIHOMEREAL", dataTeams);
  function setDataTeamsHandler(newDataTeams) {
    console.log("DATATIHOME", newDataTeams.dataTeams);
    const dataArray = Object.values(newDataTeams.dataTeams);
    setDataTeams(dataArray);
  }

  return (
    <div>
      <div className={classes.container}>
        <Board
          users={users}
          dataTeams={dataTeams}
          deleteTeam={deleteTeamHandler}
          addTeam={addTeamHandler}
          setDataTeams={setDataTeamsHandler}
          handleSaved={handleSaved}
          roles={roles}
          comparedData={comparedData}
        />
      </div>
      <div>
        Your Json Web Toke is:
        <br />{" "}
        <p style={{ overflowWrap: "break-word" }}>
          {localStorage.getItem("jwt")}
        </p>
      </div>
      <div className="row center-align">
        <button
          className="btn deep-purple darken-4 waves-effect waves-light"
          disabled={localStorage.getItem("jwt") ? false : true}
          onClick={() => {
            navigate("/signout");
          }}
          type="submit"
          name="action"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
