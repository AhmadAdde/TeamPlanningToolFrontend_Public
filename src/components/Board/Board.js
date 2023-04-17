import React, { useState, useEffect } from "react";
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
function Board({ users, dataTeams, deleteTeam, addTeam, setDataTeams }) {
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

  const [state, setState] = useState(initialData);
  console.log("STATE", state);
  function handleClick(teamname) {
    const updatedDataTeams = deleteTeam(teamname);
    const newColumnOrder = Object.keys(updatedDataTeams);
    setState({
      ...state,
      dataTeams: updatedDataTeams,
      columnOrder: newColumnOrder,
    });
  }
  useEffect(() => {
    console.log("kys2", state);
  }, [state]);
  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceCol = state.dataTeams[source.droppableId];
    const destinationCol = state.dataTeams[destination.droppableId];
    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );
      const newState = {
        ...state,
        dataTeams: {
          ...state.dataTeams,
          [newColumn.id]: newColumn,
        },
      };
      setState(newState);
      return;
    }

    const startUserIds = Array.from(sourceCol.userIds);
    const [removed] = startUserIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      userIds: startUserIds,
    };

    const endUserIds = Array.from(destinationCol.userIds);
    endUserIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      userIds: endUserIds,
    };
    const newDataTeams = {
      dataTeams: {
        ...state.dataTeams,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };
    setDataTeams(newDataTeams);
    console.log("NEWSTATE", newDataTeams);
    const newState = {
      ...state,
      dataTeams: {
        ...state.dataTeams,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };
    setState(newState);
    
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={classes.container}>
        <div className={classes.addTeam}>
          <AddTeam onAddTeam={handelAddTeam} />
        </div>
        <div className={classes.columns}>
          {state.columnOrder.map((teamId) => {
            const column = state.dataTeams[teamId];

            const users = column.userIds.map((userId) => state.users[userId]);
            console.log("KYS", users);
            return (
              <Column
                key={column.id}
                column={column}
                users={users}
                onClose={handleClick}
              />
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
}

export default Board;
