import React from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      {/* <WebSocketProvider> */}
        <AppRoutes />
      {/* </WebSocketProvider> */}
    </Router>
  );
}

export default App;
