import App from "./App.jsx";
import "./App.css";
import { AuthProvider } from "./services/context/AuthContext.jsx";
import ReactDOM from "react-dom/client";
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
  <App />
</AuthProvider>
);
