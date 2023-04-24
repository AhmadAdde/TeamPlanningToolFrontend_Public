import React, { useState, useEffect } from "react";
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
  console.log("GEY1", newUserIds);
  newUserIds.splice(endIndex, 0, removed);
  console.log("GEY2", newUserIds);
  const newColumn = {
    ...sourceCol,
    userIds: newUserIds,
  };
  return newColumn;
};
function Board({ users, dataTeams, deleteTeam, addTeam, setDataTeams, handleSaved}) {
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
  function transformDataTeams(obj) {
    const { dataTeams, ...rest } = obj;
    const transformedDataTeams = Object.values(dataTeams).map(
      ({ teamName, userIds }) => ({ teamName, userIds })
    );
    return { ...rest, dataTeams: transformedDataTeams };
  }
  function handleSave() {
    console.log("DIFFEReNCE", originalState);

    const transformedState = transformDataTeams(state);
    console.log("DIFFEReNCE", transformedState);
    const userIds2 = originalState.dataTeams.flatMap(({ userIds }) => userIds);

    const commonUserIds = userIds2.filter((userId) =>
      transformedState.dataTeams.some(({ userIds }) => userIds.includes(userId))
    );

    const dataTeams1 = transformedState.dataTeams.filter(({ userIds }) =>
      userIds.some((id) => commonUserIds.includes(id))
    );

    const dataTeams2 = originalState.dataTeams.filter(
      ({ userIds }) => !userIds.every((id) => commonUserIds.includes(id))
    );

    const output = {
      columnOrder: transformedState.columnOrder.concat(originalState.columnOrder.slice(1)),
      dataTeams: dataTeams1.concat(dataTeams2),
    };

    
    handleSaved(output);
  }
  function handleStart() {
    setOriginalState(initialData);
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

    const startUserIds = Array.from(sourceCol.userIds);
    console.log("STARTUSERIDS", startUserIds);
    const [removed] = startUserIds.splice(source.index, 1);
    console.log("REMOVED", [removed]);
    const newStartCol = {
      ...sourceCol,
      userIds: startUserIds,
    };

    console.log("NEWSTARTCOL", newStartCol);
    const endUserIds = Array.from(destinationCol.userIds);
    console.log("ENDUSERIDS", endUserIds);
    endUserIds.splice(destination.index, 0, removed);
    console.log("ENDUSERIDS", destination.index);
    const newEndCol = {
      ...destinationCol,
      userIds: endUserIds,
    };
    console.log("NEWENDCOL", newEndCol);
    const newDataTeams = {
      dataTeams: {
        ...state.dataTeams,
        [dataTeams.findIndex((team) => team.teamName === newStartCol.teamName)]:
          newStartCol,
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
        [dataTeams.findIndex((team) => team.teamName === newStartCol.teamName)]:
          newStartCol,
        [dataTeams.findIndex((team) => team.teamName === newEndCol.teamName)]:
          newEndCol,
      },
    };
    console.log("NEWSTATE", newState);
    setState(newState);
  };
  console.log("STATATDTATDTATD", state);

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
                console.log("STATEINUSERS", column);
                const userss = column.userIds.map(
                  (userId) =>
                    state.users[
                      state.users.findIndex((user) => user.username === userId)
                    ]
                );
                console.log("USERIDS", column.userIds);
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

                return (
                  <Column
                    key={column.teamName}
                    column={column}
                    users={userss}
                    onClose={handleDelete}
                    state={state}
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
