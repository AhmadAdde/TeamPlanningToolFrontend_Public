import ".././App.css";
import React from "react";
const logo = "https://team-planner.ru/assets/images/teamplanner-min.png";

export default function WelcomePage() {
  return (
    <div>
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome to the team planning tool! 😊</p>
        <a
          className="App-link"
          href="/signin"
          //target="_blank"
          rel="noopener noreferrer"
        >
          Sgin in
        </a>
        <a className="App-link" href="/signup" rel="noopener noreferrer">
          Sgin up
        </a>
      </div>
    </div>
  );
}
