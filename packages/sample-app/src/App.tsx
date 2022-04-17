import React from "react";
import "./App.css";
import { StakingButton } from "./components/Staking";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Awesome App</h1>
        <p>Now APY 1000%!</p>
        <StakingButton />
      </header>
    </div>
  );
}

export default App;
