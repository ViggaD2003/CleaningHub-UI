import React, { useState } from "react";
import { Button, Input, Form, message } from "antd";
import axiosClient from "../../services/config/axios";
import { useNavigate } from "react-router-dom";

const ConfirmEmail = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/v1/auth/verify-email`, { params: { email: values.email } });
      message.success("Code sended to your email, please");
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem("email", values.email);
        navigate("/activate-email");
      }, 2000);
    } catch (error) {
      message.error("Something wrong with your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Xác nhận Email</h2>
        
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email của bạn!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              style={{ backgroundColor: "#CF881D", borderColor: "#CF881D" }}
            >
              Kiểm tra Email
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ConfirmEmail;
