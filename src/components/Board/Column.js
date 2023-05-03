import classes from "./Column.module.css";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { toast, Toaster } from "react-hot-toast";

function Column({ column, users, onClose, changeAvailability }) {
  function handleClick() {
    toast.success("Deleted " + column.teamName);
    onClose(column.teamName);
  }

  function handleAvailabilityChange(e, user, teamName) {
    if (e.key === "Enter") {
      if (e.target.value > 100) e.target.value = 100;
      else if (e.target.value < 0) e.target.value = 0;
      console.log("CHANGE", user.username);
      console.log("CHANGE", e.target.value);
      console.log("CHANGE", teamName);
      changeAvailability(user.username, teamName, e.target.value);
    }
  }

  const userLength = Array.from(users);

  return (
    <div
      className={`${classes.column} ${
        column.teamName === "Users" ? classes.userCol : ""
      }`}
    >
      <Toaster />
      <div
        className={`${classes.header} ${
          column.teamName === "Users" ? classes.userHeader : ""
        }`}
      >
        <p className={classes.count}>{userLength.length}</p>
        <p
          className={`${classes.title} ${
            column.teamName === "Users" ? classes.userTitle : ""
          }`}
        >
          {column.teamName}
        </p>

        <span
          className={`${classes.close} ${
            column.teamName === "Users" ? classes.noClose : ""
          }`}
          onClick={() => handleClick(column.teamName)}
        >
          &times;
        </span>
      </div>
      <Droppable droppableId={`${column.teamName}`}>
        {(provided, snapshot) => (
          <div
            className={`${classes.list} ${
              column.teamName === "Users" ? classes.userList : ""
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
                      snapshot.isDragging ? classes.dragging : ""
                    }`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className={classes.info}>
                      <p>
                        {user.firstname} {user.lastname}
                      </p>
                      <p className={classes.hidden}>
                        {true ? user.username : ""}
                        <br></br>
                        {true ? user.role : ""}
                        <br></br>
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
                      </p>
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
