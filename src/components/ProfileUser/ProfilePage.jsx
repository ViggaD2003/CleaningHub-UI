import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../../services/config/axios";
import { Button, Input, Form, message, Upload, Spin, Radio } from "antd";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { UploadOutlined } from "@ant-design/icons";
import { storage } from "../../services/config/firebase";
import { DatePicker } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const GetInfo = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    gender: false,
    dob: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [form] = Form.useForm();

  const editPhoto = async (file) => {
    setPhotoLoading(true);
    try {
      const imgRef = ref(storage, `file/${uuidv4()}`);
      await uploadBytes(imgRef, file);
      const downloadURL = await getDownloadURL(imgRef);
      await axiosClient.put("/v1/auth/update/img", downloadURL);

      setImg(downloadURL);
      message.success("Profile photo updated successfully.");
    } catch (error) {
      message.error("Failed to update profile photo.");
    } finally {
      setPhotoLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/v1/auth/account");
      const data = response.data.data;
      setUserInfo(data);
      form.setFieldsValue({
        ...data,
        dob: data.dob ? moment.utc(data.dob, "YYYY-MM-DD") : null,
        gender: data.gender,
      });
      setImg(data.img);
      message.success("User info loaded successfully.");
    } catch (error) {
      message.error("Failed to load user info.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      };
      const userId = userInfo.id;
      const response = await axiosClient.put(
        `/v1/auth/account/update_profile/${userId}`,
        formattedValues
      );
      setUserInfo(response.data.data);
      message.success("User info updated successfully.");
    } catch (error) {
      message.error("Failed to update user info.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info) => {
    const file = info.file;
    if (file) {
      editPhoto(file);
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <motion.div
      className="mt-8 max-w-screen-lg mx-auto p-6 shadow-md shadow-gray-400 rounded-lg bg-slate-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2 className="profile-title text-center text-2xl font-bold mb-6">
        User Information
      </h2>

      <div className="profile-photo-wrapper flex flex-col items-center mb-4">
        {photoLoading ? (
          <Spin />
        ) : (
          <img
            src={img}
            alt="User"
            className="profile-photo w-24 h-24 object-cover rounded-full border-2 border-gray-300 mb-2"
          />
        )}
        <Upload
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleFileChange}
        >
          <button className="bg-gradient-to-r from-blue-300 to-gray-200 hover:from-gray-300 hover:to-gray-200 text-gray-600 font-bold px-6 py-2 rounded-md cursor-pointer transition-colors duration-300 flex items-center">
            <UploadOutlined className="mr-2" />
            Change Photo
          </button>
        </Upload>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={userInfo}
        onFinish={onFinish}
      >
        <Form.Item
          name="id"
          initialValue={userInfo.id}
          style={{ display: "none" }}
        >
          <Input type="hidden" />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input placeholder="Email" className="border border-gray-300 rounded p-2 w-full" />
        </Form.Item>

        <Form.Item label="First Name" name="firstName">
          <Input placeholder="First Name" className="border border-gray-300 rounded p-2 w-full" />
        </Form.Item>

        <Form.Item label="Last Name" name="lastName">
          <Input placeholder="Last Name" className="border border-gray-300 rounded p-2 w-full" />
        </Form.Item>

        <Form.Item label="Gender" name="gender">
          <Radio.Group>
            <Radio value={true}>Male</Radio>
            <Radio value={false}>Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Date of Birth" name="dob">
          <DatePicker className="border border-gray-300 rounded p-2 w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input placeholder="Address" className="border border-gray-300 rounded p-2 w-full" />
        </Form.Item>

        <Form.Item label="Phone Number" name="phoneNumber">
          <Input placeholder="Phone Number" className="border border-gray-300 rounded p-2 w-full" />
        </Form.Item>

        <Form.Item>
          <button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-gradient-to-r from-blue-300 to-gray-200 hover:from-gray-300 hover:to-gray-200 text-gray-600 font-bold px-6 py-2 rounded-md cursor-pointer transition-colors duration-300"
          >
            Update Info
          </button>
        </Form.Item>
      </Form>
      <div className="flex justify-between mt-4">
        <button
          onClick={handleChangePassword}
          className="bg-gradient-to-r from-blue-300 to-gray-200 hover:from-gray-300 hover:to-gray-200 text-gray-600 font-bold px-6 py-2 rounded-md cursor-pointer transition-colors duration-300"
        >
          Change Password
        </button>
      </div>
    </motion.div>
  );
};

export default GetInfo;
