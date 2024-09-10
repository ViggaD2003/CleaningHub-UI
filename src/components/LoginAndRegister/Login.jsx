import React, { useState } from "react";
import { Button, Input, Form, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/config/axios";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const { email, password } = values;

      // Gọi API login tại đây
      const response = await axiosClient.post(
        "/v1/auth/signin",
        { email, password },
        { withCredentials: true }
      );

      if (response.data && response.data.token) {
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refresh_token", response.data.refreshToken);

        // Hiển thị thông báo đăng nhập thành công trước khi điều hướng
        message.success({
          content: "Đăng nhập thành công. Đang chuyển trang...",
          duration: 2,  // Thời gian hiển thị thông báo (2 giây)
        });

        // Sử dụng setTimeout để trì hoãn điều hướng
        setTimeout(() => {
          setLoading(false);
          navigate("/"); // Điều hướng sau khi hiển thị thông báo
        }, 2000); // Trì hoãn 2 giây để người dùng có thể thấy thông báo
      } else {
        message.error("Invalid credentials");
      }
    } catch (error) {
      message.error("Login failed");
      console.error("Login failed", error);
    }
  };

  const handleGoogleLogin = () => {
    message.info("Google login not implemented.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-yellow-600"
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Button
            type="default"
            className="w-full flex justify-center items-center text-black border-gray-400 hover:bg-gray-200"
            onClick={handleGoogleLogin}
          >
            <GoogleOutlined className="mr-2" /> Login with Google
          </Button>
        </div>

        <div className="text-center mt-4">
          <p>
            Don't have an account?
            <a href="/register" className="text-yellow-600">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
