import React from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { WebSocketProvider } from "./services/config/provider/WebSocketProvider";
import useAuth from "./services/config/provider/useAuth";
function App() {
  const { auth } = useAuth();

  return (
    <Router>
      {auth?.role ? (
        <WebSocketProvider>
          <AppRoutes />
        </WebSocketProvider>
      ) : (
        <AppRoutes />
      )}
    </Router>
  );
}

export default App;