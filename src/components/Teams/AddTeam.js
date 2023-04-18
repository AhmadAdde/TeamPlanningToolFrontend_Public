import classes from "./AddTeam.module.css";
import { useRef } from 'react';
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
function AddTeam(props) {
  const titleInputRef = useRef();
  function submitHandler(event) {
    event.preventDefault();

    const enteredTitle = titleInputRef.current.value;
    if (enteredTitle === "Users") {
      
      toast.error("Team name cannot be Users!")
    }
    const first = new RegExp('^[a-zA-Z]+$');
    if (!first.test(enteredTitle)) {
      toast.error("Team name cannot be BLANK!!!!!")
    }
    if (enteredTitle !== "Users" && first.test(enteredTitle)) {
      toast.success("Added "  + enteredTitle)
      props.onAddTeam(enteredTitle);
    }
    const name = document.getElementById("team_name");
    name.value = "";
    
  }
  return (
    <form onSubmit={submitHandler}>
      <Toaster />
      <input type="text" name="teamName" id="team_name"className={classes.input} ref={titleInputRef}/>

      <button type="submit" value="Submit">
        AddTeam
      </button>
    </form>
  );
}
export default AddTeam;
