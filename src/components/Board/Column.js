import classes from "./Column.module.css";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { toast, Toaster } from "react-hot-toast";
import { useCollapse } from "react-collapsed";
import {useState} from "react";
function Column({ column, users, onClose }) {
  function handleClick() {
    toast.success("Deleted " + column.teamName);
    onClose(column.teamName);
  }
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });
  function mouseInEvent() {
    console.log("ALLLALWASARI")
    if (column.teamName !== "Users") {
      setExpanded(true);
    }
  }

  function mouseOutEvent() {
    if (column.teamName !== "Users") {
      setExpanded(false);
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
                key={user.username}
                draggableId={`${user.username}`}
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
