import React from "react";
import { useState, useEffect } from "react";
import FetchUserData from "./bl/userData";

export default function HomePage() {
  const [userGreeting, setUserGreeting] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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
      <p>
        Your Json Web Toke is:
        <br /> {localStorage.getItem("jwt")}
      </p>
      <div className="row center-align">
        <button
          className="btn waves-effect waves-light"
          disabled={localStorage.getItem("jwt") ? false : true}
          onClick={() => {
            localStorage.removeItem("jwt");
            localStorage.removeItem("username");
            window.location.reload();
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
