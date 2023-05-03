import React, { useState } from "react";
import classes from "./Board.module.css";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import AddTeam from "../Teams/AddTeam";
const reorderColumnList = (sourceCol, startIndex, endIndex) => {
  console.log("STARTINDEX", startIndex);
  console.log("ENDINDEX", endIndex);
  console.log("SOURCECOL", Array.from(sourceCol.userIds));
  const newUserIds = Array.from(sourceCol.userIds);
  const [removed] = newUserIds.splice(startIndex, 1);

  newUserIds.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    userIds: newUserIds,
  };
  return newColumn;
};
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
  console.log("hej", dataTeams);

  const columnOrder = Object.keys(dataTeams);
  console.log("columnOrder", columnOrder);
  const initialData = { users, dataTeams, columnOrder };

  console.log("InitialData", initialData);

  const [originalState, setOriginalState] = useState([]);
  const [state, setState] = useState(initialData);

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
  function handleSave() {
    const transformedState = transformDataTeams(state);
    console.log("SAVEDDATA", transformedState);
    const dataTeams1Map = new Map(
      originalState.dataTeams.map((team) => [team.teamName, team])
    );
    const dataTeams2Map = new Map(
      transformedState.dataTeams.map((team) => [team.teamName, team])
    );
    console.log("ORIGINAL", originalState);

    const difference = [];
    const deletedDifference = [];
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
    for (const [teamName, team] of dataTeams1Map) {
      if (!dataTeams2Map.has(teamName)) {
        deletedDifference.push(team);
      } else {
        const team1 = dataTeams2Map.get(teamName);

        if (JSON.stringify(team1.userIds) !== JSON.stringify(team.userIds)) {
          deletedDifference.push(team);
        }
      }
    }
    const output = {
      dataTeams: difference,
    };
    const output2 = {
      dataTeams: deletedDifference,
    };
    console.log("SAVEDDATA", output);
    console.log("SAVEDDATA2", output2);
    handleSaved(output, output2);
  }
  function handleStart() {
    console.log("HANDLESTARTINITAILDATA", initialData);
    const copy = { ...initialData };
    setOriginalState(copy);
    setState(initialData);
  }
  console.log("STATE", state);
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

  const onDragEnd = (result) => {
    console.log(result);
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

    if (sourceCol.teamName === destinationCol.teamName) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...state,
        dataTeams: {
          ...state.dataTeams,
          [dataTeams.findIndex((team) => team.teamName === newColumn.teamName)]:
            newColumn,
        },
      };

      setState(newState);
      return;
    }
    console.log("SOURCECOLLLLLL", sourceCol);
    if (sourceCol.teamName === "Users") {
      const startUserIds = Array.from(sourceCol.userIds);

      console.log("STARTUSERIDS", startUserIds);

      const [removed] = startUserIds.splice(source.index, 1);
      const objectToAdd = {
        username: removed,
        teamName: "Users",
        availability: 0,
        role: [],
      };
      console.log("OBJECTTOADD", objectToAdd);
      console.log("REMOVED", [removed]);
      console.log("STARTUSERIDS", startUserIds);
      const newStartCol = {
        ...sourceCol,
      };

      console.log("NEWSTARTCOL", newStartCol);
      const endUserIds = Array.from(destinationCol.userIds);
      const endMetaData = Array.from(destinationCol.metaData);
      console.log("ENDUSERIDS", endUserIds);
      endUserIds.splice(destination.index, 0, removed);
      objectToAdd.teamName = destinationCol.teamName;
      endMetaData.push(objectToAdd);
      console.log("DESTINDEX", destination.index);
      console.log("ENDUSERIDS", endUserIds);
      const newEndCol = {
        ...destinationCol,
        userIds: endUserIds,
        metaData: endMetaData,
      };
      console.log("NEWENDCOL", newEndCol);
      const newDataTeams = {
        dataTeams: {
          ...state.dataTeams,
          [dataTeams.findIndex(
            (team) => team.teamName === newStartCol.teamName
          )]: newStartCol,
          [dataTeams.findIndex((team) => team.teamName === newEndCol.teamName)]:
            newEndCol,
        },
      };
      console.log("NEWDATATEAMS", newDataTeams);
      setDataTeams(newDataTeams);
      console.log("NEWSTATE", newDataTeams);
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
      console.log("NEWSTATE", newState);
      setState(newState);
    } else {
      const startUserIds = Array.from(sourceCol.userIds);
      const startMetaData = Array.from(sourceCol.metaData);
      console.log("STARTMETADATA", startMetaData);
      console.log("STARTUSERIDS", startUserIds);

      const [removed] = startUserIds.splice(source.index, 1);
      const objectToAdd = startMetaData.find(
        (item) => item.username === removed
      );
      console.log("OBJECTTOADD", objectToAdd);
      const newArray = startMetaData.filter(
        (item) => item.username !== removed
      );
      console.log("REMOVED", [removed]);
      console.log("NEWARRAY", newArray);

      const newStartCol = {
        ...sourceCol,
        userIds: startUserIds,
        metaData: newArray,
      };

      if (destinationCol.teamName === "Users") {
        console.log("DESTINATIONCOLTEAMNAME", destinationCol.teamName);
        console.log("NEWSTARTCOL", newStartCol);
        const endUserIds = Array.from(destinationCol.userIds);
        const newEndUserIds = Array.from(destinationCol.userIds);
        console.log("ENDUSERIDS", endUserIds);
        endUserIds.splice(destination.index, 0, removed);
        console.log("DESTINDEX", destination.index);
        console.log("ENDUSERIDS", endUserIds);
        const newEndCol = {
          ...destinationCol,
          userIds: newEndUserIds,
        };
        console.log("NEWENDCOL", newEndCol);
        const newDataTeams = {
          dataTeams: {
            ...state.dataTeams,
            [dataTeams.findIndex(
              (team) => team.teamName === newStartCol.teamName
            )]: newStartCol,
            [dataTeams.findIndex(
              (team) => team.teamName === newEndCol.teamName
            )]: newEndCol,
          },
        };
        console.log("NEWDATATEAMS", newDataTeams);
        setDataTeams(newDataTeams);
        console.log("NEWSTATE", newDataTeams);
        const newState = {
          ...state,
          dataTeams: {
            ...state.dataTeams,
            [dataTeams.findIndex(
              (team) => team.teamName === newStartCol.teamName
            )]: newStartCol,
            [dataTeams.findIndex(
              (team) => team.teamName === newEndCol.teamName
            )]: newEndCol,
          },
        };
        console.log("NEWSTATE", newState);
        setState(newState);
      } else {
        console.log("DESTINATIONCOLTEAMNAME", destinationCol.teamName);
        console.log("NEWSTARTCOL", newStartCol);
        const endUserIds = Array.from(destinationCol.userIds);
        const endMetaData = Array.from(destinationCol.metaData);
        console.log("ENDUSERIDS", endUserIds);
        console.log("ENDUSERIDSMEETDATA", endMetaData);
        endUserIds.splice(destination.index, 0, removed);
        objectToAdd.teamName = destinationCol.teamName;
        endMetaData.push(objectToAdd);
        console.log("METADATAEND", endMetaData);
        console.log("DESTINDEX", destination.index);
        console.log("ENDUSERIDS", endUserIds);
        const newEndCol = {
          ...destinationCol,
          userIds: endUserIds,
          metaData: endMetaData,
        };
        console.log("NEWENDCOL", newEndCol);
        const newDataTeams = {
          dataTeams: {
            ...state.dataTeams,
            [dataTeams.findIndex(
              (team) => team.teamName === newStartCol.teamName
            )]: newStartCol,
            [dataTeams.findIndex(
              (team) => team.teamName === newEndCol.teamName
            )]: newEndCol,
          },
        };
        console.log("NEWDATATEAMS", newDataTeams);
        setDataTeams(newDataTeams);
        console.log("NEWSTATE", newDataTeams);
        const newState = {
          ...state,
          dataTeams: {
            ...state.dataTeams,
            [dataTeams.findIndex(
              (team) => team.teamName === newStartCol.teamName
            )]: newStartCol,
            [dataTeams.findIndex(
              (team) => team.teamName === newEndCol.teamName
            )]: newEndCol,
          },
        };
        console.log("NEWSTATE", newState);
        setState(newState);
      }
    }
  };
  console.log("STATATDTATDTATD", state);
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
  function changeAvailability(name, teamName, availability) {
    console.log("CHANGEDATATEAM", state.dataTeams);
    const dataTeamsArray = Object.values(state.dataTeams);
    const index = dataTeamsArray.findIndex(
      (team) => team.teamName === teamName
    );
    console.log("INDEX", index);
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

    console.log("DataTeams: ", state.dataTeams);
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
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={classes.container}>
        <div className={classes.addTeam}>
          <AddTeam onAddTeam={handelAddTeam} />
          <button onClick={handleStart}>getData</button>
          <button onClick={handleSave}>saveData</button>
        </div>
        <div className={classes.columns}>
          <div className={classes.userColumn}>
            {state.columnOrder.map((teamId) => {
              if (teamId === "0") {
                const column = state.dataTeams[teamId];

                const userss = column.userIds.map(
                  (userId) =>
                    state.users[
                      state.users.findIndex((user) => user.username === userId)
                    ]
                );

                return (
                  <Column
                    key={column.teamName}
                    column={column}
                    users={userss}
                    onClose={handleDelete}
                  />
                );
              }
              return null;
            })}
          </div>
          <div className={classes.teamsColumn}>
            {state.columnOrder.map((teamId) => {
              if (teamId !== "0") {
                const column = state.dataTeams[teamId];
                const userss = column.userIds.map(
                  (userId) =>
                    state.users[
                      state.users.findIndex((user) => user.username === userId)
                    ]
                );

                const newUsers = mergeMetaData(column.metaData, userss);

                return (
                  <Column
                    key={column.teamName}
                    column={column}
                    users={newUsers}
                    onClose={handleDelete}
                    state={state}
                    changeAvailability={changeAvailability}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Board;
