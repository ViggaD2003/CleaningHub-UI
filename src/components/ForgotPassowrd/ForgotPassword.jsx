import React, {useEffect, useState} from "react";
import { Button, Input, Form, message } from "antd";
import axiosClient from "../../services/config/axios";
import { useNavigate } from "react-router-dom";
const ForgotPassowrd = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const onFinish = async (values) => {
      try {
        setLoading(true);
        let email = localStorage.getItem("email");
        const response = await axiosClient.patch(`/v1/auth/change-forgot-password?email=${email}`, values);
        message.success(response.data);
        form.resetFields();
        
        setTimeout(() => {
            setLoading(false);
            localStorage.removeItem("email");
            navigate("/login");
        }, 2000);
      } catch (error) {
        message.error("Đã xảy ra lỗi khi thay đổi mật khẩu.");
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
        setTimeout(() => {
         localStorage.removeItem("email");
        }, 150000);
      }, []);
    return (
      <div className="change-password-container max-w-lg mt-52 mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-bold mb-6">Change Password</h2>
  
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
  
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: "Please input your new password!" }]}
          >
            <Input.Password
              placeholder="New Password"
              className="border border-gray-300 rounded p-2 w-full"
            />
          </Form.Item>
  
          <Form.Item
            label="Confirm New Password"
            name="confirmNewPassword"
            rules={[{ required: true, message: "Please confirm your new password!" }]}
          >
            <Input.Password
              placeholder="Confirm New Password"
              className="border border-gray-300 rounded p-2 w-full"
            />
          </Form.Item>
  
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-500 text-white"
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    );

} 

export default ForgotPassowrd;