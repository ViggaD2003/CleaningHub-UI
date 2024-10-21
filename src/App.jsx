import "./App.css";
import BookingNotificationComponent from "./components/BookingNotification/BookingNotificationComponent";
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
