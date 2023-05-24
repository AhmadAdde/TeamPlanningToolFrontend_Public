import React, { useState } from "react";
import classes from "./Board.module.css";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import { toast } from "react-hot-toast";
import ErrorBoard from "../layout/ErrorBoard";
import AddTeam from "../Teams/AddTeam";
import DeltaChanges from "../layout/DeltaChanges";

const reorderColumnList = (sourceCol, startIndex, endIndex) => {
  const newUserIds = Array.from(sourceCol.userIds);
  const [removed] = newUserIds.splice(startIndex, 1);
  newUserIds.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    userIds: newUserIds,
  };
  return newColumn;
};

function getDifference(dataTeams1Map, dataTeams2Map) {
  const difference = [];
  for (const [teamName, team] of dataTeams2Map) {
    if (teamName !== "Users") {
      if (!dataTeams1Map.has(teamName)) {
        difference.push(team);
      } else {
        const team1 = dataTeams1Map.get(teamName);

        if (JSON.stringify(team1.userIds) !== JSON.stringify(team.userIds)) {
          difference.push(team);
        } else {
          for (let i = 0; i < team.metaData.length; i++) {
            let metaData1 = team1.metaData[i];
            let metaData = team.metaData[i];

            if (
              metaData1.availability !== metaData.availability ||
              JSON.stringify(metaData1.role) !== JSON.stringify(metaData.role)
            ) {
              difference.push(team);
            }
          }
        }
      }
    }
  }
  return difference;
}

function Board({
  users,
  dataTeams,
  deleteTeam,
  addTeam,
  setDataTeams,
  handleSaved,
  roles,
  comparedData,
}) {
  const columnOrder = Object.keys(dataTeams);
  const initialData = { users, dataTeams, columnOrder };
  const [originalState, setOriginalState] = useState([]);
  const [state, setState] = useState(initialData);
  const mousePosition = { x: 0, y: 0 };
  var pinnedTeams = [];
  const [boolean, setBoolean] = useState(false);
  const [boolean2, setBoolean2] = useState(false);
  const [deltaChange, setDeltaChange] = useState({
    availability: { from: {}, to: {} },
    roles: { from: {}, to: {} },
    teams: { from: {}, to: {}, addedTeams: [] },
  });
  function transformDataTeams(state) {
    if (Array.isArray(state.dataTeams)) {
      return state;
    }

    const dataTeamsArray = [];

    for (const key in state.dataTeams) {
      dataTeamsArray.push(state.dataTeams[key]);
    }

    return {
      ...state,
      dataTeams: dataTeamsArray,
    };
  }
  function show() {
    if (boolean === true) {
      setBoolean(false);
    } else {
      setBoolean(true);
    }
  }
  function showErrorHandlings() {
    if (boolean2 === true) {
      setBoolean2(false);
    } else {
      setBoolean2(true);
    }
  }

  function handelAddTeam(enteredTitle) {
    const addedDataTeams = addTeam(enteredTitle);
    const newAddedColumnOrder = Object.keys(addedDataTeams);
    const copy = JSON.parse(JSON.stringify(deltaChange));
    copy.teams.addedTeams.push(enteredTitle);
    setDeltaChange({ ...deltaChange, teams: copy.teams });
    setState({
      ...state,
      dataTeams: addedDataTeams,
      columnOrder: newAddedColumnOrder,
    });
  }

  function handleSave() {
    const transformedState = transformDataTeams(state);
    const dataTeams1Map = new Map(
      originalState.dataTeams.map((team) => [team.teamName, team])
    );
    const dataTeams2Map = new Map(
      transformedState.dataTeams.map((team) => [team.teamName, team])
    );

    const difference = getDifference(dataTeams1Map, dataTeams2Map);

    const output = {
      dataTeams: difference,
    };

    toast.success("Successfully saved data");
    handleSaved(output);
  }
  function handleStart() {
    const copy = JSON.parse(JSON.stringify(initialData));

    setOriginalState(copy);
    setState(initialData);
  }
  function handleDelete(teamName) {
    const updatedDataTeams = deleteTeam(teamName);
    const newColumnOrder = Object.keys(updatedDataTeams);
    const copy = JSON.parse(JSON.stringify(deltaChange));
    copy.teams.addedTeams.pop(teamName);
    setDeltaChange({ ...deltaChange, teams: copy.teams });

    setState({
      ...state,
      dataTeams: updatedDataTeams,
      columnOrder: newColumnOrder,
    });
  }

  function mergeMetaData(metaData, users) {
    var newArray = [];
    if (!Array.isArray(metaData)) {
      Object.keys(metaData).map((key, index) => newArray.push(metaData[key]));
    } else {
      metaData.forEach((obj) => {
        newArray.push(obj);
      });
    }
    return users.map((user) => {
      const updatedUser = { ...user };
      newArray.forEach((data) => {
        if (data.username === user.username) {
          updatedUser.role = data.role;
          updatedUser.availability = data.availability;
        }
      });
      return updatedUser;
    });
  }

  function togglePinnedTeam(teamName) {
    pinnedTeams = [];
    if (state.pinnedTeams !== undefined) pinnedTeams = state.pinnedTeams;
    const teamId = Object.values(state.dataTeams).findIndex(
      (team) => team.teamName === teamName
    );
    const deleteList = pinnedTeams.filter((item) => item === teamId);
    if (deleteList.length === 0) pinnedTeams.push(teamId);
    else pinnedTeams = pinnedTeams.filter((item) => item !== teamId);
    var newColumnOrder = ["0"];
    pinnedTeams.map((item) => newColumnOrder.push(item + ""));
    newColumnOrder.push(
      ...state.columnOrder.filter((teamId) => !newColumnOrder.includes(teamId))
    );
    const newState = {
      ...state,
      columnOrder: newColumnOrder,
      pinnedTeams: pinnedTeams,
    };
    setState(newState);
  }

  function changeAvailability(name, teamName, availability) {
    const dataTeamsArray = Object.values(state.dataTeams);
    const index = dataTeamsArray.findIndex(
      (team) => team.teamName === teamName
    );
    const intAvailability = parseInt(availability);
    const changeDataTeam = dataTeamsArray[index];
    const copy = JSON.parse(JSON.stringify(deltaChange));
    if (index !== -1) {
      const metaDataIndex = changeDataTeam.metaData.findIndex(
        (obj) => obj.username === name
      );
      if (changeDataTeam.metaData[metaDataIndex]) {
        let array = [];
        if (!copy.availability.from[name]) {
          array = [
            teamName,
            changeDataTeam.metaData[metaDataIndex].availability,
          ];
          copy.availability.from[name] = array;
        }
        changeDataTeam.metaData[metaDataIndex].availability = intAvailability;
        array = [teamName, intAvailability];
        copy.availability.to[name] = array;
        if (
          JSON.stringify(copy.availability.from) ===
          JSON.stringify(copy.availability.to)
        ) {
          delete copy.availability.from[name];
          delete copy.availability.to[name];
        }

        setDeltaChange({ ...deltaChange, availability: copy.availability });
      }
    }

    if (!Array.isArray(state.dataTeams))
      state.dataTeams = Object.values(state.dataTeams);
    //const dataTeamsArray = Object.values(state.dataTeams);
    const newState = {
      ...state,
      dataTeams: [
        ...state.dataTeams.slice(0, index),
        changeDataTeam,
        ...state.dataTeams.slice(index + 1),
      ],
    };

    setState(newState);
  }

  function onDragStart(result) {
    if (result.source.droppableId === "Users") return;
    const memberElements = document.querySelectorAll(
      '[data-rbd-draggable-id="' + result.draggableId + '"]'
    );
    if (memberElements.length === 0) return;
    const memberElement = memberElements[0];
    const x = Number(memberElement.style.left.replaceAll("px", ""));
    const left = x - (220 - (mousePosition.x - x));
    const y = Number(memberElement.style.left.replaceAll("px", ""));
    const top = y - (45 - (mousePosition.y - y));
    memberElement.style.left = left + "px";
    memberElement.style.top = top + "px";
  }

  function onPersonClick(e) {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
  }

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceCol =
      state.dataTeams[
        dataTeams.findIndex((team) => team.teamName === source.droppableId)
      ];
    const destinationCol =
      state.dataTeams[
        dataTeams.findIndex((team) => team.teamName === destination.droppableId)
      ];

    const movedMemberName = result.draggableId.replaceAll(
      result.source.droppableId,
      ""
    );
    if (sourceCol.teamName === "Users" && destinationCol.teamName === "Users") {
      return;
    }
    if (destinationCol.teamName !== "Users") {
      if (destinationCol.userIds.includes(movedMemberName)) return;
    }

    const startUserIds = Array.from(sourceCol.userIds);
    const copy = JSON.parse(JSON.stringify(deltaChange));
    const [removed] = startUserIds.splice(source.index, 1);
    if (!deltaChange.teams.from[removed]) {
      copy.teams.from[removed] = sourceCol.teamName;
    }

    let removedScrum = "";
    var scrumMasters = [];
    if (sourceCol.teamName !== "Users") {
      scrumMasters = sourceCol.scrumMaster;

      for (let i = 0; i < scrumMasters.length; i++) {
        if (removed === scrumMasters[i]) {
          removedScrum = scrumMasters.splice(i, 1);
        }
      }
    }

    const endUserIds = Array.from(destinationCol.userIds);
    endUserIds.splice(destination.index, 0, removed);
    copy.teams.to[removed] = destinationCol.teamName;
    if (JSON.stringify(copy.teams.from) === JSON.stringify(copy.teams.to)) {
      delete copy.teams.from[removed];
      delete copy.teams.to[removed];
    }
    setDeltaChange({ ...deltaChange, teams: copy.teams });

    let endScrumMasters = [];
    if (destinationCol.teamName !== "Users") {
      endScrumMasters = Array.from(destinationCol.scrumMaster);

      if (removedScrum.length >= 1 || removedScrum) {
        endScrumMasters.push(removedScrum[0]);
      }
    }

    const updateState = (newStartCol, newEndCol) => {
      const newState = {
        ...state,
        dataTeams: {
          ...state.dataTeams,
          [dataTeams.findIndex(
            (team) => team.teamName === newStartCol.teamName
          )]: newStartCol,
          [dataTeams.findIndex((team) => team.teamName === newEndCol.teamName)]:
            newEndCol,
        },
      };
      setState(newState);
    };

    if (sourceCol.teamName === destinationCol.teamName) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );
      updateState(newColumn, newColumn);
      return;
    }

    const startMetaData = Array.from(sourceCol.metaData);
    const objectToAdd =
      sourceCol.teamName === "Users"
        ? {
            username: removed,
            teamName: "Users",
            availability: 0,
            role: [],
          }
        : startMetaData.find((item) => item.username === removed);

    var newStartCol = {
      ...sourceCol,
      userIds: startUserIds,
      scrumMaster: scrumMasters,
      metaData: startMetaData.filter((item) => item.username !== removed),
    };
    if (sourceCol.teamName === "Users") {
      startUserIds.push(objectToAdd.username);

      newStartCol = {
        ...sourceCol,
        userIds: startUserIds,
        metaData: startMetaData.filter((item) => item.username !== removed),
      };
    }

    const endMetaData = Array.from(destinationCol.metaData);

    var newEndCol = {
      ...destinationCol,
      userIds: endUserIds,
      scrumMaster: endScrumMasters,
      metaData:
        destinationCol.teamName === "Users"
          ? endMetaData
          : [
              ...endMetaData,
              { ...objectToAdd, teamName: destinationCol.teamName },
            ],
    };
    if (destinationCol.teamName === "Users") {
      newEndCol = {
        ...destinationCol,
        metaData:
          destinationCol.teamName === "Users"
            ? endMetaData
            : [
                ...endMetaData,
                { ...objectToAdd, teamName: destinationCol.teamName },
              ],
      };
    }
    updateState(newStartCol, newEndCol);

    const newDataTeams = {
      dataTeams: {
        ...state.dataTeams,
        [dataTeams.findIndex((team) => team.teamName === newStartCol.teamName)]:
          newStartCol,
        [dataTeams.findIndex((team) => team.teamName === newEndCol.teamName)]:
          newEndCol,
      },
    };
    setDataTeams(newDataTeams);
  };
  function setRole(name, teamName, role, deleteOrNot) {
    const dataTeamsArray = Object.values(state.dataTeams);
    const index = dataTeamsArray.findIndex(
      (team) => team.teamName === teamName
    );

    const changeDataTeam = dataTeamsArray[index];
    const scrumMasters = Array.from(changeDataTeam.scrumMaster);

    if (index !== -1) {
      const metaDataIndex = changeDataTeam.metaData.findIndex(
        (obj) => obj.username === name
      );
      const startRole = JSON.parse(
        JSON.stringify(changeDataTeam.metaData[metaDataIndex].role)
      );
      let array = [];
      const copy = JSON.parse(JSON.stringify(deltaChange));
      if (deleteOrNot === false) {
        if (role === "Scrum Master") {
          changeDataTeam.scrumMaster.push(name);
        }
        if (changeDataTeam.metaData[metaDataIndex]) {
          if (!copy.roles.from[name]) {
            array = [teamName, startRole];
            copy.roles.from[name] = array;
          }
          changeDataTeam.metaData[metaDataIndex].role.push(role);
          array = [teamName, changeDataTeam.metaData[metaDataIndex].role];
          copy.roles.to[name] = array;
        }
      } else {
        if (role === "Scrum Master") {
          const indexScrum = scrumMasters.indexOf(name);
          changeDataTeam.scrumMaster.splice(indexScrum, 1);
        }
        const index = changeDataTeam.metaData[metaDataIndex].role.indexOf(role);

        changeDataTeam.metaData[metaDataIndex].role.splice(index, 1);
        array = [teamName, changeDataTeam.metaData[metaDataIndex].role];
        copy.roles.to[name] = array;
      }
      if (JSON.stringify(copy.roles.from) === JSON.stringify(copy.roles.to)) {
        delete copy.roles.from[name];
        delete copy.roles.to[name];
      }
      setDeltaChange({ ...deltaChange, roles: copy.roles });
    }

    if (!Array.isArray(state.dataTeams))
      state.dataTeams = Object.values(state.dataTeams);

    const newState = {
      ...state,
      dataTeams: [
        ...state.dataTeams.slice(0, index),
        changeDataTeam,
        ...state.dataTeams.slice(index + 1),
      ],
    };
    setState(newState);
  }
  function sortUsers(sortedUsers) {
    let dataTeamsWithSorted = state.dataTeams;
    let sortUserIdsUsers = dataTeamsWithSorted[0];

    let userIndexMap = new Map();
    sortedUsers.forEach((user, index) => {
      userIndexMap.set(user.username, index);
    });

    sortUserIdsUsers.userIds.sort(
      (a, b) => userIndexMap.get(a) - userIndexMap.get(b)
    );
    dataTeamsWithSorted[0] = sortUserIdsUsers;

    setState({ ...state, dataTeams: dataTeamsWithSorted });
  }

  const renderColumns = (teamIdCondition, additionalProps = {}) => {
    return state.columnOrder.map((teamId) => {
      if (teamIdCondition(teamId)) {
        const column = state.dataTeams[teamId];
        const userss = column.userIds.map(
          (userId) =>
            state.users[
              state.users.findIndex((user) => user.username === userId)
            ]
        );

        const newUsers =
          teamId !== "0" ? mergeMetaData(column.metaData, userss) : userss;

        return (
          <Column
            key={column.teamName}
            column={column}
            users={newUsers}
            onClose={handleDelete}
            boolean={boolean}
            originalDataTeams={originalState.dataTeams}
            {...additionalProps}
            roles={roles}
            setRole={setRole}
            comparedData={comparedData}
            sort={sortUsers}
          />
        );
      }
      return null;
    });
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className={classes.container}>
        <div className={classes.conSwitch}>
          <input
            onClick={showErrorHandlings}
            type="checkbox"
            className={classes.checkbox}
            id={classes.checkbox}
          />
          <label className={classes.switch} htmlFor={classes.checkbox}>
            <span className={classes.slider}></span>
          </label>
        </div>
        <div
          className={`${classes.showErrors} ${
            boolean2 ? classes.hideErrors : ""
          }`}
        >
          <div className={classes.section}>
            <div className={classes.addTeam}>
              <AddTeam onAddTeam={handelAddTeam} />
            </div>
            <div className={classes.deltaChanges}>
              <DeltaChanges deltaChanges={deltaChange} users={users} />
            </div>
          </div>
          <div className={classes.errorBoard}>
            <ErrorBoard
              dataTeams={state.dataTeams}
              comparedData={comparedData}
            />
          </div>
        </div>
        <div className={classes.buttons}>
          <button className={classes.button} onClick={handleStart}>
            Get Data
          </button>
          <button className={classes.button} onClick={handleSave}>
            Save Data
          </button>
          <div className={classes.conSwitch}>
            <input
              onClick={show}
              type="checkbox"
              className={classes.checkbox}
              id={classes.checkbox}
            />
            <label className={classes.switch} htmlFor={classes.checkbox}>
              <span className={classes.slider}></span>
            </label>
          </div>
        </div>
        <div className={classes.columns}>
          <div className={classes.userColumn}>
            {renderColumns((teamId) => teamId === "0")}
          </div>
          <div className={classes.teamsColumn} onMouseDown={onPersonClick}>
            {renderColumns((teamId) => teamId !== "0", {
              state,
              changeAvailability,
              togglePinnedTeam,
            })}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Board;
