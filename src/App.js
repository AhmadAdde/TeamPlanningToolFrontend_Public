import "./App.css";
const logo = "https://team-planner.ru/assets/images/teamplanner-min.png";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome to the team plannig tool! 😊</p>
        <a
          className="App-link"
          href="/signin"
          //target="_blank"
          rel="noopener noreferrer"
        >
          Sgin in
        </a>
        <a
          className="App-link"
          href="/signup"
          //target="_blank"
          rel="noopener noreferrer"
        >
          Sgin up
        </a>
      </header>
    </div>
  );
}

export default App;
