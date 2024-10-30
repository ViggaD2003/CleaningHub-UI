import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { AuthProvider } from "../src/services/context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
