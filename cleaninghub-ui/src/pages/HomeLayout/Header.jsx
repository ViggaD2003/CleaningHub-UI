import React from "react";
import { Button, Space } from "antd";
import useAuth from "../../services/config/provider/useAuth";
import { Header as HeaderAntd } from "antd/es/layout/layout";

const Header = () => {
  const { auth } = useAuth();

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
      <div className="flex items-center space-x-4">
        <Button type="default" className="text-white bg-yellow-700 border-none">
          Login
        </Button>
        <Button type="primary" className="text-white bg-yellow-700 border-none">Register</Button>
      </div>
    </HeaderAntd>
  );
};

export default Header;
