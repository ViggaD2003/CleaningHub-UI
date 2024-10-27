import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { WebSocketProvider } from "./services/config/provider/WebSocketProvider";

function App() {

  return (
    <>
      <Router>
        <WebSocketProvider>
          <AppRoutes />
        </WebSocketProvider>
      </Router>
    </>
  );
}

export default App;
