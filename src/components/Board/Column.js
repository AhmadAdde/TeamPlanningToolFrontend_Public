import classes from "./Column.module.css";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { toast, Toaster } from "react-hot-toast";
import pin_selected from "../../assets/pin_selected.png";
import pin_unselected from "../../assets/pin_unselected.png";
import Filter from "../layout/Filter";
import { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

function Column({
  column,
  users,
  onClose,
  changeAvailability,
  togglePinnedTeam,
  boolean,
  originalDataTeams,
  roles,
  setRole,
  comparedData,
  sort,
}) {
  var isNotCloseColumn = false;
  const [sortOrder, setSortOrder] = useState(null);
  const isUsersColumn = column.teamName === "Users";
  for (let i = 0; i < originalDataTeams.length; i++) {
    if (column.teamName === originalDataTeams[i].teamName) {
      isNotCloseColumn = true;
    }
  }

  const handleSortChange = (newSortOrder) => {
    if (newSortOrder !== sortOrder) {
      if (newSortOrder === "down") {
        users.sort((a, b) => (a.firstname > b.firstname ? 1 : -1));
      } else if (newSortOrder === "up") {
        users.sort((a, b) => (a.firstname < b.firstname ? 1 : -1));

      }
      setSortOrder(newSortOrder);
    } else {
      setSortOrder(null);
    }
    sort(users);
  };

  function handleClick() {
    toast.success("Deleted " + column.teamName);
    onClose(column.teamName);
  }
  function handleAvailabilityChange(e, user, teamName) {
    if (e.target.value > 100) {
      e.target.value = 100;
      e.preventDefault();
    } else if (e.target.value < 0) {
      e.target.value = 0;
      e.preventDefault();
    }
    if (e.key === "Enter") {
      changeAvailability(user.username, teamName, e.target.value);
    }
  }

  function handleTogglePinnedTeam(e) {
    if (e.target.nodeName === "A") return;
    const a = e.target.parentElement,
      img = e.target;
    const isPinned = !a.classList.contains(classes.pinned_wrapper_team);
    a.classList.toggle(classes.pinned_wrapper_team, isPinned);
    img.src = isPinned ? pin_selected : pin_unselected;
    togglePinnedTeam(column.teamName);
  }
  function setRoles(role, user, deleteOrNot) {
    setRole(user.username, column.teamName, role, deleteOrNot);
  }

  const userLength = users.length;
  let scrumMasterClass = "";
  if (column.scrumMaster) {
    if (column.scrumMaster.length === 0) {
      scrumMasterClass = classes.yellow;
    } else if (column.scrumMaster.length > 1) {
      scrumMasterClass = classes.red;
    }
  }
  function userDifference(name) {
    for (let key in comparedData) {
      let data = comparedData[key];

      for (let key2 in data) {
        if (data[key2].size !== 0) {
          let dataConf = data[key2];

          if (dataConf[name]) {
            if (dataConf[name][0] === column.teamName) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  return (
    <div
      className={`${classes.column} ${isUsersColumn ? classes.userCol : ""}${
        boolean && !isUsersColumn ? classes.biggerColumn : ""
      }`}
    >
      <Toaster />
      <div
        className={`${classes.header} ${scrumMasterClass} ${
          isUsersColumn ? classes.userHeader : ""
        }`}
      >
        <div className={classes.wrapper}>
          <div className={classes.pin_wrapper}>
            <img
              src={pin_unselected}
              className={classes.pin}
              onClick={handleTogglePinnedTeam}
              alt="pin unselected"
            ></img>
          </div>
          <p className={classes.count}>
            <span>{userLength}</span>
          </p>
        </div>
        <p
          className={`${classes.title} ${
            isUsersColumn ? classes.userTitle : ""
          }`}
        >
          {column.teamName.replaceAll("_", " ")}
        </p>
        <span
          className={`${classes.justASpan} ${
            !isNotCloseColumn ? classes.noJustASpan : ""
          }`}
        ></span>
        <div
          className={`${classes.noSwitch} ${
            isUsersColumn ? classes.switch : ""
          }`}
        >
          <div className={classes.con}>
            <FormControlLabel
            sx={{
              marginTop: "8px",
              color: 'white',
            }}
              control={
                <Checkbox
                  checked={sortOrder === "down"}
                  onChange={() => handleSortChange("down")}
                />
              }
              label="A-Z"
            />
            <FormControlLabel 
            sx={{
              marginTop: "8px",
              color: 'white',
            }}
              control={
                <Checkbox
                  checked={sortOrder === "up"}
                  onChange={() => handleSortChange("up")}
                />
              }
              label="Z-A"
            />
          </div>
        </div>
        <span
          className={`${classes.close} ${
            isNotCloseColumn ? classes.noClose : ""
          }`}
          onClick={handleClick}
        >
          &times;
        </span>
      </div>
      <Droppable droppableId={`${column.teamName}`}>
        {(provided, snapshot) => (
          <div
            className={`${classes.list} ${
              isUsersColumn ? classes.userList : ""
            }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {users.map((user, index) => (
              <Draggable
                key={user.username + column.teamName}
                draggableId={`${user.username + column.teamName}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    className={`${classes.users} ${
                      userDifference(user.firstname + " " + user.lastname)
                        ? classes.changeUserColor
                        : ""
                    }${snapshot.isDragging ? classes.dragging : ""}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className={classes.info}>
                      <p>
                        {user.firstname} {user.lastname}
                      </p>
                      <div className={classes.hidden}>
                        <p className={classes.username}>{user.username}</p>

                        <Filter roles={roles} user={user} setRole={setRoles} />

                        <span className={classes.rt_input}>
                          <input
                            name="availability"
                            id="availability"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={user.availability}
                            onKeyPress={(e) =>
                              handleAvailabilityChange(e, user, column.teamName)
                            }
                          />
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
export default Column;
