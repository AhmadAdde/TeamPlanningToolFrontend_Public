import classes from "./ErrorBoard.module.css";

function ErrorBoard({ dataTeams, comparedData }) {
  console.log("DATATEAMS", dataTeams);
  console.log("COMPAREDDATA", comparedData);
  dataTeams = Object.values(dataTeams);

  const teamsWithoutScrumMaster = dataTeams
    .filter(
      (team) =>
        team.teamName !== "Users" &&
        team.scrumMaster &&
        team.scrumMaster.length === 0
    )
    .map((team) => team.teamName)
    .join(", ");
  const teamsWithMoreScrumMaster = dataTeams
    .filter(
      (team) =>
        team.teamName !== "Users" &&
        team.scrumMaster &&
        team.scrumMaster.length > 1
    )
    .map((team) => team.teamName)
    .join(", ");

  let {
    availabilityComponents: availabilityConf,
    rolesComponents: rolesConf,
    nameComponents: nameConf,
  } = generateComponents(comparedData.confluence || {});
  let {
    availabilityComponents: availabilityIrm,
    rolesComponents: rolesIrm,
    nameComponents: nameIrm,
  } = generateComponents(comparedData.irm || {});
  /*<div className={classes.irm}>
          <p>IRM:</p>
          <div>{availabilityString + rolesString + nameString}</div>
        </div>*/
  console.log("No scrums: ", teamsWithoutScrumMaster);
  return (
    <div className={classes.container}>
      <div className={classes.scrumsDifferences}>
        <div className={classes.moreScrumMaster}>
          <p>To Many Scrum Masters:</p>
          <div>{teamsWithMoreScrumMaster}</div>
        </div>
        <div className={classes.noScrumMaster}>
          <p>No Scrum Masters:</p>
          <div>{teamsWithoutScrumMaster}</div>
        </div>
      </div>
      <div className={classes.comparisonConfAndIrm}>
        <div className={classes.conf}>
          <p>Confluence:</p>
          <div className={classes.availability}>
            <p>Availability:</p>
            <div>{availabilityConf}</div>
          </div>
          <div className={classes.roles}>
            <p>Roles:</p>
            <div>{rolesConf}</div>
          </div>
          <div className={classes.name}>
            <p>Name:</p>
            <div>{nameConf}</div>
          </div>
        </div>
        <div className={classes.irm}>
          <p>IRM:</p>
          <div className={classes.availability}>
            <p>Availability:</p>
            <div>{availabilityIrm}</div>
          </div>
          <div className={classes.roles}>
            <p>Roles:</p>
            <div>{rolesIrm}</div>
          </div>
          <div className={classes.name}>
            <p>Name:</p>
            <div>{nameIrm}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
const generateComponents = (data) => {
  let availabilityComponents = [];
  let rolesComponents = [];
  let nameComponents = [];

  if (Object.keys(data).length > 0) {
    if (Object.keys(data.availability).length > 0) {
      for (let [name, entry] of Object.entries(data.availability)) {
        let team = entry[0];
        let availability = entry[1];
        availabilityComponents.push(
          <div key={`availability-${name}`}>
            <span className={classes.bold}>{name}</span> in{" "}
            <span className={classes.bold}>{team}</span> has{" "}
            <span className={classes.bold}>{availability}%</span> availability. 
          </div>
        );
      }
    }

    if (Object.keys(data.roles).length > 0) {
      for (let [name, entry] of Object.entries(data.roles)) {
        let team = entry[0];
        let roles = entry[1];
        rolesComponents.push(
          <div key={`roles-${name}`}>
            <span className={classes.bold}>{name}</span> in{" "}
            <span className={classes.bold}>{team}</span> has the roles:{" "}
            <span className={classes.bold}>{roles}</span>.
          </div>
        );
      }
    }

    if (Object.keys(data.name).length > 0) {
      for (let [name, teamName] of Object.entries(data.name)) {
        nameComponents.push(
          <div key={`name-${name}`}>
            <span className={classes.bold}>{name}</span> in{" "}
            <span className={classes.bold}>{teamName}</span>.
          </div>
        );
      }
    }
  }

  return { availabilityComponents, rolesComponents, nameComponents };
};
export default ErrorBoard;
