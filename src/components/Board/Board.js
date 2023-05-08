import React, { useState } from "react";
import classes from "./Board.module.css";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import AddTeam from "../Teams/AddTeam";

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
    if (!dataTeams1Map.has(teamName)) {
      difference.push(team);
    } else {
      const team1 = dataTeams1Map.get(teamName);

      if (JSON.stringify(team1.userIds) !== JSON.stringify(team.userIds)) {
        difference.push(team);
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
}) {
  function handelAddTeam(enteredTitle) {
    const addedDataTeams = addTeam(enteredTitle);
    const newAddedColumnOrder = Object.keys(addedDataTeams);
    setState({
      ...state,
      dataTeams: addedDataTeams,
      columnOrder: newAddedColumnOrder,
    });
  }

  const columnOrder = Object.keys(dataTeams);
  const initialData = { users, dataTeams, columnOrder };
  const [originalState, setOriginalState] = useState([]);
  const [state, setState] = useState(initialData);
  const mousePosition = { x: 0, y: 0 };
  var pinnedTeams = [];

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
    const deletedDifference = getDifference(dataTeams2Map, dataTeams1Map);

    const output = {
      dataTeams: difference,
    };
    const output2 = {
      dataTeams: deletedDifference,
    };

    handleSaved(output, output2);
  }
  function handleStart() {
    const copy = { ...initialData };
    setOriginalState(copy);
    setState(initialData);
  }
  function handleDelete(teamName) {
    const updatedDataTeams = deleteTeam(teamName);
    const newColumnOrder = Object.keys(updatedDataTeams);
    setState({
      ...state,
      dataTeams: updatedDataTeams,
      columnOrder: newColumnOrder,
    });
  }

  const findTeamIndex = (teamName) =>
    dataTeams.findIndex((team) => team.teamName === teamName);

  const updateStateDataTeams = (newStartCol, newEndCol) => {
    const newDataTeams = {
      ...state.dataTeams,
      [findTeamIndex(newStartCol.teamName)]: newStartCol,
      [findTeamIndex(newEndCol.teamName)]: newEndCol,
    };
    setState({ ...state, dataTeams: newDataTeams });
  };

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
      newArray.map((data) => {
        if (data.username === user.username) {
          updatedUser.availability = data.availability;
        }
      });
      return updatedUser;
    });
  }

  function togglePinnedTeam(teamName) {
    pinnedTeams = [];
    if(state.pinnedTeams !== undefined) pinnedTeams = state.pinnedTeams;
    const teamId = Object.values(state.dataTeams).findIndex((team) => team.teamName === teamName);
    const deleteList = pinnedTeams.filter((item) => item === teamId);
    if(deleteList.length == 0) pinnedTeams.push(teamId);
    else pinnedTeams = pinnedTeams.filter((item) => item !== teamId);
    var newColumnOrder = ["0"];
    pinnedTeams.map(item => newColumnOrder.push(item + ''));
    newColumnOrder.push(...state.columnOrder.filter((teamId) => !newColumnOrder.includes(teamId)));
    const newState = {
      ...state,
      columnOrder: newColumnOrder,
      pinnedTeams: pinnedTeams
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

    if (index !== -1) {
      const metaDataIndex = changeDataTeam.metaData.findIndex(
        (obj) => obj.username === name
      );
      if (changeDataTeam.metaData[metaDataIndex]) {
        changeDataTeam.metaData[metaDataIndex].availability = intAvailability;
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
    if(result.source.droppableId == "Users") return;
    const memberElements = document.querySelectorAll('[data-rbd-draggable-id="' + result.draggableId + '"]');
    if(memberElements.length == 0) return;
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
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
  
    const sourceCol = state.dataTeams[dataTeams.findIndex((team) => team.teamName === source.droppableId)];
    const destinationCol = state.dataTeams[dataTeams.findIndex((team) => team.teamName === destination.droppableId)];
  
    const movedMemberName = result.draggableId.replaceAll(result.source.droppableId, "");
    if (destinationCol.userIds.includes(movedMemberName)) return;
  
    const startUserIds = Array.from(sourceCol.userIds);
    const [removed] = startUserIds.splice(source.index, 1);
  
    const endUserIds = Array.from(destinationCol.userIds);
    endUserIds.splice(destination.index, 0, removed);
  
    const updateState = (newStartCol, newEndCol) => {
      const newState = {
        ...state,
        dataTeams: {
          ...state.dataTeams,
          [dataTeams.findIndex((team) => team.teamName === newStartCol.teamName)]: newStartCol,
          [dataTeams.findIndex((team) => team.teamName === newEndCol.teamName)]: newEndCol,
        },
      };
      setState(newState);
    };
  
    if (sourceCol.teamName === destinationCol.teamName) {
      const newColumn = reorderColumnList(sourceCol, source.index, destination.index);
      updateState(newColumn, newColumn);
      return;
    }
  
    const startMetaData = Array.from(sourceCol.metaData);
    const objectToAdd = sourceCol.teamName === "Users" ? {
      username: removed,
      teamName: "Users",
      availability: 0,
      role: [],
    } : startMetaData.find((item) => item.username === removed);
  
    const newStartCol = {
      ...sourceCol,
      userIds: startUserIds,
      metaData: startMetaData.filter((item) => item.username !== removed),
    };
  
    const endMetaData = Array.from(destinationCol.metaData);
    const newEndCol = {
      ...destinationCol,
      userIds: endUserIds,
      metaData: destinationCol.teamName === "Users" ? endMetaData : [...endMetaData, { ...objectToAdd, teamName: destinationCol.teamName }],
    };
  
    updateState(newStartCol, newEndCol);
  
    const newDataTeams = {
      dataTeams: {
        ...state.dataTeams,
        [dataTeams.findIndex((team) => team.teamName === newStartCol.teamName)]: newStartCol,
        [dataTeams.findIndex((team) => team.teamName === newEndCol.teamName)]: newEndCol,
      },
    };
    setDataTeams(newDataTeams);
  };  

  const renderColumns = (teamIdCondition, additionalProps = {}) => {
    return state.columnOrder.map((teamId) => {
      if (teamIdCondition(teamId)) {
        const column = state.dataTeams[teamId];
        const userss = column.userIds.map(
          (userId) => state.users[state.users.findIndex((user) => user.username === userId)]
        );
  
        const newUsers = teamId !== "0" ? mergeMetaData(column.metaData, userss) : userss;
  
        return (
          <Column
            key={column.teamName}
            column={column}
            users={newUsers}
            onClose={handleDelete}
            {...additionalProps}
          />
        );
      }
      return null;
    });
  };
  
  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className={classes.container}>
        <div className={classes.addTeam}>
          <AddTeam onAddTeam={handelAddTeam} />
          <button onClick={handleStart}>getData</button>
          <button onClick={handleSave}>saveData</button>
          <button onClick={show}>Show Order</button>
        </div>
        <div className={classes.columns}>
          <div className={classes.userColumn}>
            {renderColumns((teamId) => teamId === "0")}
          </div>
          <div className={classes.teamsColumn} onMouseDown={onPersonClick}>
            {renderColumns((teamId) => teamId !== "0", {
              state,
              changeAvailability,
              togglePinnedTeam
            })}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Board;
