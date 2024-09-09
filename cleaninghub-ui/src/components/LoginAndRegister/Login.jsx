import React, {useState} from "react";
import axiosClient from "../../services/config/axios";
import { notification } from "antd";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosClient.post(
        "/v1/auth/signin",
        { username, password },
        { withCredentials: true }
      );
      if (data.data !== null) {
        axiosClient.defaults.headers.common["Authorization"] =
          `Bearer ${data.token}`;
        localStorage.setItem("token", data.token);
        localStorage.setItem("refresh_token", data.refresh_token);
        notification.success({
          message: "Đăng nhập thành công",
          description: "Bạn đã đăng nhập. Đang chuyển trang...",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 1500); // Redirects after 1.5 seconds
      } else {
        notification.error({
          message: "Đăng nhập thất bại",
          description:
            "Sai tài khoản hoặc mật khẩu hoặc tài khoản chưa được kích hoạt.",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000); // Redirects after 3 seconds
      }
    } catch (error) {
      setError("Login failed");
      console.error("Login failed", error);
    }
  };

  return (

    <>
        <div className="">
        danh
        </div>
    </>
  )
}

export default Login;