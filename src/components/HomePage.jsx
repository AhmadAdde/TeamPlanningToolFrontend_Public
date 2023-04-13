import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FetchUserData from "./bl/userData";
import TeamDataComp from "./team_data/TeamDataComp";

export default function HomePage() {
  const [userGreeting, setUserGreeting] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
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

  return (
    <div>
      <h1>Welcome to Home page! 😊</h1>
      {errorMessage && <div>{errorMessage}</div>}
      <h4>{userGreeting}</h4>
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
      <TeamDataComp />
    </div>
  );
}
