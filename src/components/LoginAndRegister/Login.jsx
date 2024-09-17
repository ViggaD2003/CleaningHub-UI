import { useState } from "react";
import { Button, Input, Form, Checkbox, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/config/axios";
import loginImage from "../../assets/image/login.jpg";



const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const { email, password } = values;

      // API login call
      const response = await axiosClient.post(
        "/v1/auth/signin",
        { email, password },
        { withCredentials: true }
      );

      if (response.data && response.data.token) {
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refresh_token", response.data.refreshToken);

        // Success message
        message.success({
          content: "Đăng nhập thành công. Đang chuyển trang...",
          duration: 2,
        });

        // Navigate after delay
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 2000);
      } else {
        setLoading(false);
        message.error("Invalid credentials");
      }
    } catch (error) {
      setLoading(false);
      message.error("Login failed");
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 rounded-l-lg">
        <img
          src={loginImage}
          alt="Cleaning Service"
          className="object-cover w-full h-full md:h-auto rounded-lg"/>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Login to your Account</h2>
          <p className="text-center mb-6">See what is going on with your business</p>
          <Button
            type="default"
            className="w-full mb-4 flex justify-center items-center text-black border-gray-400 hover:bg-gray-200"
            onClick={handleGoogleLogin}
          >
            <GoogleOutlined className="mr-2" /> Continue with Google
          </Button>
          <div className="text-center mb-4">
            <h6>or Sign in with Email</h6>
            </div>
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
              <Checkbox>Remember Me</Checkbox>
              <a href="/" className="float-right text-yellow-600">Forgot Password?</a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-500"
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <p>
              Not Registered Yet?
              <a href="/register" className="text-yellow-600"> Create an account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;