import React, { useState } from "react";
import classes from "./Filter.module.css";
import { Checkbox } from "@mui/material";

function Filter({ roles, user, setRole }) {
  const [isActive, setIsActive] = useState(false);

  const initialOtherChecked = roles
    .slice(1)
    .map((role) => (user.role ? user.role.includes(role) : false));
  const [otherChecked, setOtherChecked] = useState(initialOtherChecked);

  if (!user.role) {
    return null;
  }

  const toggleOther = (index) => {
    const newOtherChecked = [...otherChecked];
    newOtherChecked[index] = !newOtherChecked[index];
    setOtherChecked(newOtherChecked);

    if (newOtherChecked[index] === true) {
      setRole(roles[index], user, false);
    } else {
      setRole(roles[index], user, true);
    }
  };

  function handleClick() {
    setIsActive(!isActive);
  }

  function handleUlClick(event) {
    event.stopPropagation();
  }
  let rolesArray = Array.isArray(user.role) ? user.role : [];

  return (
    <div
      onClick={handleClick}
      className={`${classes.filter} ${isActive ? classes.isActive : ""}`}
    >
      <h5 className={classes.sortAfter}>{rolesArray.join(", ")}</h5>
      <ul className={classes.list} onClick={handleUlClick}>
        {roles.map((role, index) => (
          <li key={index}>
            <label>
              <Checkbox
                label="others"
                checked={otherChecked[index]}
                onChange={() => toggleOther(index)}
              />

              {role}
            </label>
          </li>
        ))}
      </ul>
      <div className={classes.arrow}></div>
    </div>
  );
}

export default Filter;
