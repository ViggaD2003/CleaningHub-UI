import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button, Dropdown, Space, notification } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { Header as HeaderAntd } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/config/axios";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLoginPage = () => {
    navigate("/login");
  };

  const handleRegisterPage = () => {
    navigate("/register");
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
            getInfoUser();
          }}
        >
          Profile
        </a>
      ),
    },
  ];

  const getInfoUser = () => {
    navigate("/getInformation");
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
      localStorage.removeItem("refreshToken");

      // Điều hướng về trang chủ sau khi đăng xuất
      navigate("/");
    } catch (error) {
      notification.error({
        message: "Lỗi đăng xuất",
        description: error?.message || "Đã xảy ra sự cố. Vui lòng thử lại sau!",
      });
    }
  };

  return (
    <HeaderAntd className="flex justify-between items-center bg-white h-24 px-8 shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          {" "}
          {/* Wrap the logo with Link */}
          <img
            src="https://www.btaskee.com/wp-content/uploads/2020/10/btaskee_logo_02.png"
            alt="Logo"
            className="h-12"
          />
        </Link>
      </div>

      {/* Middle Menu */}
      <div className="flex space-x-8">
        <a href="#home" className="text-gray-700 hover:text-black">
          Home
        </a>
        <a href="#about" className="text-gray-700 hover:text-black">
          About
        </a>
        <a href="#pricing" className="text-gray-700 hover:text-black">
          Pricing
        </a>
        <a href="#service" className="text-gray-700 hover:text-black">
          Service
        </a>
        <a href="#contact" className="text-gray-700 hover:text-black">
          Contact
        </a>
      </div>

      {/* Right side: Login, Register */}
      {isLoggedIn ? (
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar size={42} className="ml-5" icon={<UserOutlined />} />
              <DownOutlined className="text-xl ml-2" />
            </Space>
          </a>
        </Dropdown>
      ) : (
        <div className="flex items-center space-x-4">
          <Button
            type="default"
            className="text-yellow-700 border-yellow-700 hover:bg-yellow-50"
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
