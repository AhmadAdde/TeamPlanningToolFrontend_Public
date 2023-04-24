import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FetchUserData from "./bl/userData";
import getPersons from "../components/TeamData/teamData";
import classes from "./HomePage.module.css";

import Board from "./Board/Board";

export default function HomePage() {
  const [userGreeting, setUserGreeting] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [deletedTeams, setDeletedTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataTeams, setDataTeams] = useState([])
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getPersons.getPersons();
        setUsers(response);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const usersArray = users.map(user => user.username);
      setDataTeams([{ teamName: "Users", userIds: usersArray }]);
    }
  }, [users]);
  
  console.log("USERSBACKEN", users);
  console.log("DATA TEAMS", dataTeams);
  const navigate = useNavigate();

  function addTeamHandler(enteredTeamName) {
    const updatedDataTeams = [
      ...dataTeams,
      { teamName: enteredTeamName, userIds: [] },
    ];
    setDataTeams(updatedDataTeams);
    return updatedDataTeams;
  }
  useEffect(() => {
    console.log("hejsan", dataTeams);
  }, [dataTeams]);
  function deleteTeamHandler(teamName) {
    const newDeletedTeams = [...deletedTeams, teamName];
    setDeletedTeams(newDeletedTeams)
    const removedTeam = dataTeams.filter((team) => team.teamName === teamName);
    const updatedDataTeams = dataTeams.filter(
      (team) => team.teamName !== teamName
    );

    if (removedTeam[0].userIds.length > 0) {
      console.log("USERID", removedTeam[0].userIds);
      const newUsersUserIds = dataTeams[0].userIds.concat(
        removedTeam[0].userIds
      );
      const sortedNewUsersUserIds = newUsersUserIds.sort();
      console.log("USERID", sortedNewUsersUserIds);

      updatedDataTeams[0].userIds = sortedNewUsersUserIds;
    }

    /*const updatedDataTeamsWithNewIds = updatedDataTeams.map((team, index) => {
      return {
        ...team,
        id: index,
      };
    });
    console.log("walla", updatedDataTeamsWithNewIds);*/
    setDataTeams(updatedDataTeams);
    return updatedDataTeams;
  }
  function handleSaved(savedData) {
    console.log("SAVEDDATA",savedData)
    console.log("DELETEDDATA", deletedTeams)
  }

  console.log("DATATIHOMEREAL", dataTeams);
  function setDataTeamsHandler(newDataTeams) {
    console.log("DATATIHOME", newDataTeams.dataTeams);
    const dataArray = Object.values(newDataTeams.dataTeams);
    setDataTeams(dataArray);
  }

  return (
    <div>
      <h1>Welcome to Home page! 😊</h1>
      {errorMessage && <div>{errorMessage}</div>}
      <h4>{userGreeting}</h4>

      <div className={classes.container}>
        <Board
          users={users}
          dataTeams={dataTeams}
          deleteTeam={deleteTeamHandler}
          addTeam={addTeamHandler}
          setDataTeams={setDataTeamsHandler}
          handleSaved={handleSaved}
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
