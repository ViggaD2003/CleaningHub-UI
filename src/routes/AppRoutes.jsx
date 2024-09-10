import { Route, Routes } from "react-router-dom";
import HomeLayout from "../pages/HomeLayout/HomeLayOut";
import HomePage from "../components/HomePage/HomePage";
import SignIn from "../components/LoginAndRegister/Login";
import SignUp from "../components/LoginAndRegister/Register";

export default function AppRoutes() {
  // const { auth } = useAuth();

  return (
    <>
        <Routes>
        <Route path="login" element={<SignIn/>}/>
        <Route path="register" element={<SignUp/>}/>
          <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomePage/>}/>
          </Route>
        </Routes>
    </>
  );
}
