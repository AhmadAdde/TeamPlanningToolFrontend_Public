import classes from "./DeltaChanges.module.css";
function DeltaChanges({ deltaChanges, users }) {
  let availabilityComponents = [];
  let rolesComponents = [];
  let teamComponents = [];
  let addedTeamsComponents = deltaChanges.teams.addedTeams.join(", ");
  if (Object.keys(deltaChanges).length > 0) {
    if (deltaChanges.availability) {
      for (let [name, entry] of Object.entries(
        deltaChanges.availability.from
      )) {
        let fullName = "";
        for (let i = 0; i < users.length; i++) {
          if (users[i].username === name) {
            fullName = users[i].firstname + " " + users[i].lastname;
          }
        }
        let team = entry[0];
        let availability = entry[1];
        let availabilityNew = deltaChanges.availability.to[name][1];
        availabilityComponents.push(
          <div key={`availability-${name}`}>
            <span className={classes.bold}>{fullName}</span> in{" "}
            <span className={classes.bold}>{team}</span> has{" "}
            <span className={classes.bold}>{availability}%</span> availability =
            {">"} <span className={classes.bold}>{fullName}</span> in{" "}
            <span className={classes.bold}>{team}</span> has{" "}
            <span className={classes.bold}>{availabilityNew}%</span>{" "}
            availability
          </div>
        );
      }
    }

    if (Object.keys(deltaChanges.roles).length > 0) {
      for (let [name, entry] of Object.entries(deltaChanges.roles.from)) {
        let fullName = "";
        for (let i = 0; i < users.length; i++) {
          if (users[i].username === name) {
            fullName = users[i].firstname + " " + users[i].lastname;
          }
        }
        let team = entry[0];
        let roles = entry[1];
        let rolesNew = deltaChanges.roles.to[name][1].join(", ");
        rolesComponents.push(
          <div key={`roles-${name}`}>
            <span className={classes.bold}>{fullName}</span> in{" "}
            <span className={classes.bold}>{team}</span> has the roles:{" "}
            <span className={classes.bold}>{roles} </span> ={">"}{" "}
            <span className={classes.bold}>{fullName}</span> in{" "}
            <span className={classes.bold}>{team}</span> has the roles:{" "}
            <span className={classes.bold}>{rolesNew}</span>
          </div>
        );
      }
    }

    if (Object.keys(deltaChanges.teams).length > 0) {
      for (let [name, teamName] of Object.entries(deltaChanges.teams.from)) {
        let fullName = "";
        for (let i = 0; i < users.length; i++) {
          if (users[i].username === name) {
            fullName = users[i].firstname + " " + users[i].lastname;
          }
        }
        let newTeamName = deltaChanges.teams.to[name];
        teamComponents.push(
          <div key={`name-${name}`}>
            <span className={classes.bold}>{fullName}</span> in{" "}
            <span className={classes.bold}>{teamName} </span> ={"> "}
            <span className={classes.bold}>{fullName}</span> in{" "}
            <span className={classes.bold}>{newTeamName}</span>
          </div>
        );
      }
    }
  }
  return (
    <div className={classes.container}>
      <div className={classes.availability}>
        <p>Availability: </p>
        <div>{availabilityComponents}</div>
      </div>
      <div className={classes.roles}>
        <p>Roles: </p>
        <div>{rolesComponents}</div>
      </div>
      <div className={classes.teams}>
        <p>Teams: </p>
        <div>{teamComponents}</div>
      </div>
      <div className={classes.addedTeams}>
        <p>Added Teams: </p>
        <div>{addedTeamsComponents}</div>
      </div>
    </div>
  );
}
export default DeltaChanges;
