import { Button, Input, Form, Checkbox, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import axiosClient from "../../services/config/axios";
import loginImage from "../../assets/image/login.jpg";



const LoginPage = () => {
  const [form] = Form.useForm();

  const handleGoogleLogin = async () => {
    window.location.href =
      "https://ch-api.arisavinh.dev/oauth2/authorization/google";
  };

  const handleSubmit = async (values) => {
    const { email, password } = values;
  
    try {
      const response = await axiosClient.post(
        "/v1/auth/signin",
        { email, password },
        { withCredentials: true }
      );
  
      // Kiểm tra nếu đăng nhập thành công
      if (response.data && response.data.token) {
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.refreshToken}`;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refresh_token", `Bearer ${response.data.refreshToken}`);
  
        message.success({
          content: "Đăng nhập thành công. Đang chuyển trang...",
        });
  
       setTimeout(() => {
        window.location.href = "/"
       }, 1000);
      }
    } catch (error) {
      message.error({
        content: `${error.response.data.businessErrorCode} ${error.response.data.error}`,
        duration: 2,
      });
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen">
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
              <a href="/confirm-email" className="float-right text-yellow-600 hover:text-orange-800">Forgot Password?</a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-[#7fc7f7] "
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <p>
              Not Registered Yet?
              <a href="/register" className="text-yellow-600 hover:text-orange-800"> Create an account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;