import React from "react";
import "./App.css";
import { StakeButton } from "./components/StakeButton";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Awesome App</h1>
        <p>Current APY 10000%!</p>
        <StakeButton />
      </header>
    </div>
  );
}

export default App;
