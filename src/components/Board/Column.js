import classes from "./Column.module.css";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { toast, Toaster } from "react-hot-toast";
import pin_selected from "../../assets/pin_selected.png";
import pin_unselected from "../../assets/pin_unselected.png";

function Column({ column, users, onClose, changeAvailability, togglePinnedTeam }) {
  const isUsersColumn = column.teamName === "Users";

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
    if(e.target.nodeName == 'A') return;
    const a = e.target.parentElement, img = e.target;
    const isPinned = !a.classList.contains(classes.pinned_wrapper_team);
    a.classList.toggle(classes.pinned_wrapper_team, isPinned);
    img.src = isPinned ? pin_selected : pin_unselected;
    togglePinnedTeam(column.teamName);
  }

  const userLength = users.length;

  return (
    <div className={`${classes.column} ${isUsersColumn ? classes.userCol : ""}`}>
      <Toaster/>
      <div className={`${classes.header} ${isUsersColumn ? classes.userHeader : ""}`}>
        <p className={classes.count}>
          <a onClick={handleTogglePinnedTeam} className={classes.pin_wrapper}>
            <img src={pin_unselected} className={classes.pin}></img>
          </a>
          <span>{userLength}</span>
        </p>
        <p className={`${classes.title} ${isUsersColumn ? classes.userTitle : ""}`}>
          {column.teamName}
        </p>
        <span className={`${classes.close} ${isUsersColumn ? classes.noClose : ""}`} onClick={handleClick}>
          &times;
        </span>
      </div>
      <Droppable droppableId={`${column.teamName}`}>
        {(provided, snapshot) => (
          <div className={`${classes.list} ${isUsersColumn ? classes.userList : ""}`} ref={provided.innerRef} {...provided.droppableProps}>
            {users.map((user, index) => (
              <Draggable key={user.username + column.teamName} draggableId={`${user.username + column.teamName}`} index={index}>
                {(provided, snapshot) => (
                  <div className={`${classes.users} ${snapshot.isDragging ? classes.dragging : ""}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <div className={classes.info}>
                      <p>
                        {user.firstname} {user.lastname}
                      </p>
                      <p className={classes.hidden}>
                        {user.username}<br />
                        {user.role}<br />
                        <span className={classes.rt_input}>
                          <input
                            name="availability"
                            id="availability"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={user.availability}
                            onKeyPress={(e) => handleAvailabilityChange(e, user, column.teamName)}
                          />%
                        </span>
                      </p>
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
