import { Route, Routes } from "react-router-dom";
import HomeLayout from "../pages/HomeLayout/HomeLayOut";
import HomePage from "../components/HomePage/HomePage";
import SignIn from "../components/LoginAndRegister/Login";
import SignUp from "../components/LoginAndRegister/Register";
import SignInGoogle from "../components/LoginAndRegister/LoginGoogle";
import ActivateAccount from "../components/LoginAndRegister/Activate-account";
import GetInfo from "../components/ProfileIser/ProfilePage";

export default function AppRoutes() {
  // const { auth } = useAuth();

  return (
    <>
        <Routes>
        <Route path="login" element={<SignIn/>}/>
        <Route path="register" element={<SignUp/>}/>
        <Route path="login-success" element={<SignInGoogle/>}/>
        <Route path="activate-account" element={<ActivateAccount/>}/>

          <Route path="/" element={<HomeLayout />}>
          <Route path="getInformation" element={<GetInfo/>}/>
          <Route index element={<HomePage/>}/>
          </Route>
          
        </Routes>
    </>
  );
}
