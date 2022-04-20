import React, { useState } from "react";
import "./App.css";
import { StakeButton } from "./components/StakeButton";
import { Transaction } from "./components/Transaction";
import { TransactionContext } from "./context";

function App() {
  const [hash, setHash] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        <TransactionContext.Provider value={{ hash, setHash }}>
          <Transaction />
          <h1>Awesome App</h1>
          <p>Current APY 10000%!</p>
          <StakeButton />
        </TransactionContext.Provider>
      </header>
    </div>
  );
}

export default App;
