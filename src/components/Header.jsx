import React from "react";

export default function Header() {
  return (
    <div className="top-nav">
      <nav>
        <div className="nav-wrapper deep-purple darken-4">
          <a href="/" className="brand-logo">
            Team Planing Tool
          </a>
          <a href="/" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>

          {localStorage.getItem("jwt") && (
            <ul className="right hide-on-med-and-down">
              <li>
                <a href="/">Welcome</a>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {localStorage.getItem("jwt") && (
        <ul className="sidenav" id="mobile-demo">
          <li>
            <a href="/">Welcome</a>
          </li>
        </ul>
      )}
    </div>
  );
}
