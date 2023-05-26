import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getPersons from "../components/TeamData/teamData";

import classes from "./HomePage.module.css";

import Board from "./Board/Board";

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [deletedTeams, setDeletedTeams] = useState([]);
  const [dataTeams, setDataTeams] = useState([]);
  const [roles, setRoles] = useState([]);
  const [comparedData, setComparedData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const loadData = await getPersons.loadDataToDatabase();

        setComparedData(loadData);
        const userResponse = await getPersons.getPersons();
        setUsers(userResponse);

        const response = await getPersons.getTeams();

        const rolesResponse = await getPersons.getRoles();
        setRoles(rolesResponse);

        const userColumn = { teamName: "Users", userIds: [] };
        for (var i = 0; i < userResponse.length; i++) {
          userColumn.userIds.push(userResponse[i].username);
        }

        response.push(userColumn);

        const newDataTeams = [];

        response.forEach((team) => {
          const transformedTeam = {
            teamName: team.teamName,
            metaData: team.metaData ? Object.values(team.metaData) : [],
            scrumMaster: team.scrumMaster,
            userIds: team.userIds,
          };

          newDataTeams.push(transformedTeam);
        });

        setDataTeams(newDataTeams.reverse());
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, []);

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

    setDataTeams(updatedDataTeams);
    return updatedDataTeams;
  }

  function handleSaved(savedData) {
    getPersons
      .saveDataTeams(savedData.dataTeams)
      .catch((response) => console.log(response));

    let teamNamesArray = savedData.dataTeams.map((team) => team.teamName);

    getPersons.updateDatasources(teamNamesArray);
  }

  function setDataTeamsHandler(newDataTeams) {
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
