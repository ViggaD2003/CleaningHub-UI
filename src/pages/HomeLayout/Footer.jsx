import React from "react";
import { Layout } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";

const { Footer: FooterAntd } = Layout;

const Footer = () => {
  return (
    <FooterAntd className="text-white p-8" style={{backgroundColor: "#CF881D"}}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: Company Info */}
        <div>
          <h3 className="text-xl font-bold">Clean Nest</h3>
          <p className="text-sm">© 2024 FPT University. All Rights Reserved.</p>
        </div>

        {/* Middle Section: Important Links */}
        <div className="flex space-x-6">
          <a href="#contact" className="text-white">
            Contact Us
          </a>
          <a href="#privacy" className="text-white">
            Privacy Policy
          </a>
          <a href="#terms" className="text-white">
            Terms of Service
          </a>
        </div>

        {/* Right Section: Social Icons */}
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FacebookOutlined className="text-white text-2xl" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <TwitterOutlined className="text-white text-2xl" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <InstagramOutlined className="text-white text-2xl" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <LinkedinOutlined className="text-white text-2xl" />
          </a>
        </div>
      </div>
    </FooterAntd>
  );
};

export default Footer;
