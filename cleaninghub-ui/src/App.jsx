import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

function App() {

  return (
    <>
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
