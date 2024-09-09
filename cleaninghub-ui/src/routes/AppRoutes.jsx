import { Route, Routes } from "react-router-dom";
import HomeLayout from "../pages/HomeLayout/HomeLayOut";
import HomePage from "../components/HomePage/HomePage";

export default function AppRoutes() {
  // const { auth } = useAuth();

  return (
    <>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomePage/>}/>
          </Route>
        </Routes>
    </>
  );
}
