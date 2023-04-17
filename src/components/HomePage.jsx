import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FetchUserData from "./bl/userData";
import getPersons from "../components/team_data/teamData";
import classes from "./HomePage.module.css";

import Board from "./Board/Board";

export default function HomePage() {
  const [userGreeting, setUserGreeting] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const usersArray = [];
  const users = getPersons.getPersons();
  for (let i = 0; i < users.length; i++) {
    usersArray.push(i);
  }

  const [dataTeams, setDataTeams] = useState([
    { id: 0, teamName: "Users", userIds: usersArray },
    
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    FetchUserData.getUserGreeting()
      .then((response) => {
        setUserGreeting(response);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);
  function addTeamHandler(enteredTeamName) {
    const updatedDataTeams = [
      ...dataTeams,
      { id: dataTeams.length, teamName: enteredTeamName, userIds: [] },
    ];
    setDataTeams(updatedDataTeams);
    return updatedDataTeams;
  }
  useEffect(() => {
    console.log("hejsan", dataTeams);
  }, [dataTeams]);
  function deleteTeamHandler(teamName) {
    const removedTeam = dataTeams.filter(
      (team) => team.teamName === teamName
    );
    const updatedDataTeams = dataTeams.filter(
      (team) => team.teamName !== teamName
    
    );
    
    if (removedTeam[0].userIds.length > 0) {
      console.log("USERID",removedTeam[0].userIds)
      const newUsersUserIds = dataTeams[0].userIds.concat(removedTeam[0].userIds);
      const sortedNewUsersUserIds= newUsersUserIds.sort();
      console.log("USERID",sortedNewUsersUserIds);
      
      updatedDataTeams[0].userIds = sortedNewUsersUserIds;
    }
    
    const updatedDataTeamsWithNewIds = updatedDataTeams.map((team, index) => {
      return {
        ...team,
        id: index,
      };
    });
    console.log("walla", updatedDataTeamsWithNewIds);
    setDataTeams(updatedDataTeamsWithNewIds);
    return updatedDataTeamsWithNewIds;
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
