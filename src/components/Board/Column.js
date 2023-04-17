import classes from "./Column.module.css";
import { Draggable, Droppable } from "react-beautiful-dnd";

function Column({ column, users, onClose }) {
  function handleClick() {
    onClose(column.teamName);
  }
  const userLength = Array.from(users);
  console.log("USERS", users);
  return (
    <div
      className={`${classes.column} ${
        column.teamName === "Users" ? classes.userCol : ""
      }`}
    >
      <div
        className={`${classes.header} ${
          column.teamName === "Users" ? classes.userHeader : ""
        }`}
      >
        
        <p className={classes.count}>{userLength.length}</p>
        <p className={classes.title}>{column.teamName}</p>
       
          <span
            className={`${classes.close} ${
              column.teamName === "Users" ? classes.noClose : ""
            }`}
            onClick={() => handleClick(column.teamName)}
          >
            &times;
          </span>
        
      </div>
      <Droppable droppableId={`${column.id}`}>
        {(provided, snapshot) => (
          <div
            className={classes.list}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {users.map((user, index) => (
              <Draggable key={user.id} draggableId={`${user.id}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={`${classes.users} ${
                      snapshot.isDragging ? classes.dragging : ""
                    }`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className={classes.info}>
                      <p className={classes.firstname}>{user.firstname}</p>
                      <p className={classes.team}>Team: {user.team}</p>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </div>
  );
}
export default Column;
