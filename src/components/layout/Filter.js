import React, { useState } from "react";
import classes from "./Filter.module.css";
import { Checkbox } from "@mui/material";

function Filter({ roles, user, setRole }) {
    const [isActive, setIsActive] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    
    // Define the initial state of otherChecked
    const initialOtherChecked = roles.slice(1).map(role => user.role ? user.role.includes(role) : false);
    const [otherChecked, setOtherChecked] = useState(initialOtherChecked);
  
    if (!user.role) {
      return null;
    }
  const toggleAll = () => {
    setAllChecked(!allChecked);
    setOtherChecked(otherChecked.map(() => !allChecked));
  };

  const toggleOther = (index) => {
    const newOtherChecked = [...otherChecked];
    newOtherChecked[index] = !newOtherChecked[index];
    setOtherChecked(newOtherChecked);

    const allOtherChecked = newOtherChecked.every((checked) => checked);
    setAllChecked(allOtherChecked);
    
    if (newOtherChecked[index] === true) {
        console.log("APA");
        setRole(roles[index + 1], user, false)
    } else {
        setRole(roles[index + 1], user, true)
    }
    console.log(`Checkbox for role ${roles[index + 1]}: ${newOtherChecked[index] ? 'Checked' : 'Unchecked'}`);
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
      <h5 className={classes.sortAfter}>{rolesArray.join(', ')}</h5>
      <ul className={classes.list} onClick={handleUlClick}>
        <li key={roles[0]}>
          <label>
            <Checkbox label="any" checked={allChecked} onChange={toggleAll} />
            {roles[0]}
          </label>
        </li>
        {roles.slice(1).map((role, index) => (
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
