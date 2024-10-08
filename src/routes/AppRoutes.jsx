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
import BookingHistory from "../components/BookingHistoryByUser/BookingHistory.jsx";
import Booking from "../components/Booking/Booking.jsx";
import Map from "../components/Map/Map.jsx";
import BookingSuccess from "../components/Booking/BookingSuccess.jsx";

// Import các thành phần cho trang Admin
import Sidebar from "../pages/Admin/Sidebar.jsx";
import OverviewPage from "../pages/Admin/OverviewPage.jsx";
import PaymentHistory from "../components/PaymentHistory/PaymentHIstory.jsx";
import CalendarComponent from "../pages/Calendar/Calendar.jsx";

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

        <Route element={<HomeLayout />}>
          <Route path="/"/>
          <Route path="getInformation" element={<GetInfo />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/services/all" element={<AllServicesPage />} />
          <Route index element={<HomePage />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="map" element={<Map />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/bookings/:id" element={<Booking />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Route>

        {/* Các route cho trang Admin */}
        <Route
          path="/admin/*"
          element={
            <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
              <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
                <div className="absolute inset-0 backdrop-blur-sm" />
              </div>
              <Sidebar />
              <Routes>
                <Route path="overview" element={<OverviewPage />} />
                <Route path="calendar" element={<CalendarComponent/>}/>
              </Routes>
            </div>
          }
        />
      </Routes>
    </>
  );
}
