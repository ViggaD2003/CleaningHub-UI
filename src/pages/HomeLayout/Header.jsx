import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button, ConfigProvider, Dropdown, Space, notification } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Header as HeaderAntd } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/config/axios";
import { Spin } from "antd"; // Optional: for loading spinner if needed
import logo from "../../assets/image/462553616_977405051091530_8584369157051684469_n-removebg-preview.png"
import NotificationIconComponent from "../../components/Notifications/NotificationIcon/NotificationIconComponent";
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState({});
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserInfo();
    }
  }, [isLoggedIn]);

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/v1/auth/account");
      const data = response.data.data;
      setUserInfo(data);
      setImg(data.img); // Set the user's profile image
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải thông tin người dùng.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPage = () => {
    window.location.href = "/login";
  };

  const handleRegisterPage = () => {
    window.location.href = "/register";
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axiosClient.post(
        "/v1/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      notification.success({
        message: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất thành công.",
        duration: 2,
      });
      setIsLoggedIn(false);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login"
    } catch (error) {
      notification.error({
        message: "Lỗi đăng xuất",
        description: error?.message || "Đã xảy ra sự cố. Vui lòng thử lại sau!",
      });
    }
  };

  const items = [
    {
      key: "1",
      danger: true,
      label: (
        <a
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Đăng xuất
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          onClick={(e) => {
            e.preventDefault();
            navigate("/getInformation");
          }}
        >
          Profile
        </a>
      ),
    },
    {
      key: "bookingHistory",
      label: (
        <a
          onClick={(e) => {
            e.preventDefault();
            navigate("/booking-history");
          }}
        >
          Booking History
        </a>
      ),
    }
  ];

  return (
    <HeaderAntd
      className="flex justify-between items-center h-24 px-8 shadow-md bg-gradient-to-r from-blue-100 to-blue-300 p-4"
    // style={{ backgroundColor: "#CF881D" }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-28"
          />
        </Link>
      </div>

      {/* Middle Menu */}
      <div className="flex text-center space-x-36">
        <Link
          to="/"
          className="text-white hover:text-blue-300 font-bold text-xl"
        >
          Home
        </Link>
        <a
          href="https://www.facebook.com/profile.php?id=61566508168892"
          className="text-white hover:text-blue-300 font-bold text-xl"
        >
          About
        </a>

        <Link
          to="/services/all"
          className="text-white hover:text-blue-300 font-bold text-xl"
        >
          Service
        </Link>

        <Link
          to="/blogs"
          className="text-white hover:text-blue-300 font-bold text-xl"
        >
          Blogs
        </Link>
      </div>

      {/* Right side: Login, Register, or User Menu */}
      {isLoggedIn ? (
        <div className="flex items-center space-x-4">
          <NotificationIconComponent/>
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {loading ? (
                  <Spin />
                ) : (
                  <Avatar
                    size={42}
                    src={img || "https://joeschmoe.io/api/v1/random"}
                    className="ml-5"
                  />
                )}
                <DownOutlined className="text-xl ml-2" />
              </Space>
            </a>
          </Dropdown>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <ConfigProvider
            theme={{
              token: {
                colorPrimaryHover: "#333",
                colorPrimaryBgHover: "#333",
                // colorPrimaryHover:"#333",
              },
            }}
          >

            <Button
              // type="primary"
              className="px-10 py-6 text-white  font-extrabold bg-gradient-to-r from-blue-500 to-green-500 shadow-lg"
              onClick={handleLoginPage}
            >
              Login
            </Button>

            <Button
              // type="primary"
              className="px-8 py-6 text-white font-extrabold   bg-gradient-to-r from-blue-500 to-green-500 shadow-lg"
              onClick={handleRegisterPage}
            >
              Sign Up
            </Button>
          </ConfigProvider>
        </div>
      )}
    </HeaderAntd>
  );
};

export default Header;