import { useState } from "react";
import { Button, Input, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/config/axios";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const nagative = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    const roleId = 2;
    try {
        const {firstName, lastName, email, password} = values;

        const response = await axiosClient.post(
          "/v1/auth/signup",
          {firstName, lastName, email, password, roleId},
        )
        message.success({
          content: "Create successfully !",
          duration: 2,
        });

        setTimeout(() => {
          setLoading(false);
          nagative("/activate-account");
        }, 2000);
    } catch (error) {
      message.error("Sign up fail");
      console.error("Sign up failed", error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96 md:w-1/3 lg:w-1/4">
        <h2 className="text-2x1 font-blod text-center mb-6">
          Create New Account
        </h2>
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

          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input placeholder="Enter your first name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input placeholder="Enter your last name" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-yellow-600"
              loading={loading}
            >
              submit
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-4">
          <p>
          Already have an account?
            <a href="/login" className="text-yellow-600">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
