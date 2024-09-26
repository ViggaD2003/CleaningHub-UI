import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button, Dropdown, Space, notification } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Header as HeaderAntd } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/config/axios";
import { Spin } from "antd"; // Optional: for loading spinner if needed

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
    navigate("/login");
  };

  const handleRegisterPage = () => {
    navigate("/register");
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
      navigate("/");
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
  ];

  return (
    <HeaderAntd
      className="flex justify-between items-center h-24 px-8 shadow-md"
      style={{ backgroundColor: "#CF881D" }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src="https://www.btaskee.com/wp-content/uploads/2020/10/btaskee_logo_02.png"
            alt="Logo"
            className="h-12"
          />
        </Link>
      </div>

      {/* Middle Menu */}
      <div className="flex space-x-8">
        <a href="#home" className="text-white hover:text-orange-800 font-bold text-xl">
          Home
        </a>
        <a href="#about" className="text-white hover:text-orange-800 font-bold text-xl">
          About
        </a>
        <a href="#pricing" className="text-white hover:text-orange-800 font-bold text-xl">
          Pricing
        </a>
        <a href="#service" className="text-white hover:text-orange-800 font-bold text-xl">
          Service
        </a>
        <a href="#contact" className="text-white hover:text-orange-800 font-bold text-xl">
          Contact
        </a>
      </div>

      {/* Right side: Login, Register, or User Menu */}
      {isLoggedIn ? (
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
      ) : (
        <div className="flex items-center space-x-4">
          <Button
            type="default"
            className="text-yellow-700 border-yellow-700 hover:bg-yellow-800"
            onClick={handleLoginPage}
          >
            Login
          </Button>
          <Button
            type="primary"
            className="bg-yellow-700 border-none hover:bg-yellow-800"
            onClick={handleRegisterPage}
          >
            Sign Up
          </Button>
        </div>
      )}
    </HeaderAntd>
  );
};

export default Header;
