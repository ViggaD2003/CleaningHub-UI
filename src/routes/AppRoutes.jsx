import { Route, Routes } from "react-router-dom";
import HomeLayout from "../pages/HomeLayout/HomeLayOut";
import HomePage from "../components/HomePage/HomePage";
import SignIn from "../components/LoginAndRegister/Login";
import SignUp from "../components/LoginAndRegister/Register";
import SignInGoogle from "../components/LoginAndRegister/LoginGoogle";
import ActivateAccount from "../components/LoginAndRegister/Activate-account";
import GetInfo from "../components/ProfileUser/ProfilePage.jsx";
import ChangePassword from "../components/ChangePassword/ChangePassword";
import ConfirmEmail from "../components/ForgotPassowrd/ConfirmEmail";
import PageLayout from "../pages/HomeLayout/PageLayOut";
import ActivateEmail from "../components/ForgotPassowrd/Activate-email";
import ForgotPassowrd from "../components/ForgotPassowrd/ForgotPassword";
import ServiceDetail from "../components/Service/ServiceDetail.jsx";
import AllServicesPage from "../components/Service/AllServicesPage.jsx";
import Map from "../components/Map/Map.jsx";

// Import các thành phần cho trang Admin
import Sidebar from "../pages/Admin/Sidebar.jsx";
import OverviewPage from "../pages/Admin/OverviewPage.jsx";
import PaymentHistory from "../components/PaymentHistory/PaymentHIstory.jsx";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Các route cho người dùng */}
        <Route element={<PageLayout />}>
          <Route path="login" element={<SignIn />} />
          <Route path="register" element={<SignUp />} />
          <Route path="login-success" element={<SignInGoogle />} />
          <Route path="activate-account" element={<ActivateAccount />} />
          <Route path="confirm-email" element={<ConfirmEmail />} />
          <Route path="activate-email" element={<ActivateEmail />} />
          <Route path="forgot-password" element={<ForgotPassowrd />} />
        </Route>

          <Route path="/" element={<HomeLayout />}>
           <Route path="getInformation" element={<GetInfo/>}/>
           <Route path="/services/:id" element={<ServiceDetail />} />
           <Route path="/services/all" element={<AllServicesPage />} />
           <Route index element={<HomePage/>}/>
           <Route path="change-password" element={<ChangePassword/>}/>
          </Route>
        </Routes>
    </>
  );
}
