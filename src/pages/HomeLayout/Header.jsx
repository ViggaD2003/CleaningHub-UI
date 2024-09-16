import React, { useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Space,
  notification,
} from "antd";
import {
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
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
    navigate("/register")
  }

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
    navigate("/getInformation")
  }

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axiosClient.post(
        "/v1/auth/logout", {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Hiển thị thông báo đăng xuất thành công
      notification.success({
        message: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất thành công.",
        duration: 2, // Thời gian hiển thị thông báo
      });

      // Cập nhật trạng thái đăng nhập
      setIsLoggedIn(false);

      // Xóa token
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");

      // Điều hướng về trang chủ sau khi đăng xuất
      navigate("/");
      
    } catch (error) {
      // Thông báo lỗi nếu có vấn đề xảy ra
      notification.error({
        message: "Lỗi đăng xuất",
        description: error?.message || "Đã xảy ra sự cố. Vui lòng thử lại sau!",
      });
    }
  };

  return (
    <HeaderAntd className="flex justify-between items-center bg-slate-300 h-24 px-8">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="https://www.btaskee.com/wp-content/uploads/2020/10/btaskee_logo_02.png"
          alt="Logo"
          className="h-12"
        />
      </div>

      {/* Middle Menu: About, Price */}
      <div className="flex space-x-8">
        <a href="#about" className="text-white text-lg">
          About
        </a>
        <a href="#price" className="text-white text-lg">
          Price
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
            className="text-white bg-yellow-700 border-none"
            onClick={handleLoginPage}
          >
            Login
          </Button>
          <Button type="primary" className="text-white bg-yellow-700 border-none"
          onClick={handleRegisterPage}
          >
            Register
          </Button>
        </div>
      )}
    </HeaderAntd>
  );
};

export default Header;
