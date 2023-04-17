import classes from "./AddTeam.module.css";
import { useRef } from 'react';

function AddTeam(props) {
  const titleInputRef = useRef();
  function submitHandler(event) {
    event.preventDefault();

    const enteredTitle = titleInputRef.current.value;
   
    props.onAddTeam(enteredTitle);
  }
  return (
    <form onSubmit={submitHandler}>
      <input type="text" name="teamName" className={classes.input} ref={titleInputRef}/>

      <button type="submit" value="Submit">
        AddTeam
      </button>
    </form>
  );
}
export default AddTeam;
