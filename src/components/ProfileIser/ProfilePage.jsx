import React, { useEffect, useState } from "react";
import axiosClient from "../../services/config/axios";
import { Button, Input, Form, message, Upload, Spin, Radio } from "antd";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { UploadOutlined } from "@ant-design/icons";
import { storage } from "../../services/config/firebase";
import { DatePicker } from "antd";
import moment from "moment";

const GetInfo = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    gender: false, // Boolean field
    dob: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
  });

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
      console.log(downloadURL);
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
      
      setUserInfo(data); // Cập nhật userInfo trong state
      form.setFieldsValue({
        ...data,
        dob: data.dob ? moment.utc(data.dob, "YYYY-MM-DD") : null,
        gender: data.gender // Đảm bảo giá trị gender là boolean
      }); // Cập nhật giá trị vào form
  
      setImg(data.img); // Cập nhật hình ảnh nếu cần
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
        dob: values.dob ? (values.dob).format('YYYY-MM-DD') : null
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
    console.log(info);
    if (file) {
      editPhoto(file);
    }
  };

  return (
    <div className="profile-container max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="profile-title text-center text-2xl font-bold mb-6">
        User Information
      </h2>

      <div className="profile-photo-wrapper flex justify-center mb-4">
        {photoLoading ? (
          <Spin />
        ) : (
          <img
            src={img}
            alt="User"
            className="profile-photo w-24 h-24 object-cover rounded-full border-2 border-gray-300"
          />
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={userInfo}
        onFinish={onFinish}
      >
        <Form.Item name="id" initialValue={userInfo.id} style={{ display: "none" }}>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input
            placeholder="Email"
            value={userInfo.email}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password
            placeholder="Password"
            value={userInfo.password}
            className="border border-gray-300 rounded p-2 w-full"
            readOnly
          />
        </Form.Item>

        <Form.Item label="First Name" name="firstName">
          <Input
            placeholder="First Name"
            value={userInfo.firstName}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </Form.Item>

        <Form.Item label="Last Name" name="lastName">
          <Input
            placeholder="Last Name"
            value={userInfo.lastName}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </Form.Item>

        <Form.Item label="Gender" name="gender">
          <Radio.Group>
            <Radio value={true}>Male</Radio>
            <Radio value={false}>Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Date of Birth" name="dob">
          <DatePicker
             className="border border-gray-300 rounded p-2 w-full"
              format="YYYY-MM-DD" // Định dạng ngày
           />
          </Form.Item>

        <Form.Item label="Address" name="address">
          <Input
            placeholder="Address"
            value={userInfo.address}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </Form.Item>

        <Form.Item label="Phone Number" name="phoneNumber">
          <Input
            placeholder="Phone Number"
            value={userInfo.phoneNumber}
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
            Update Info
          </Button>
        </Form.Item>
      </Form>

      <Upload
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleFileChange}
      >
        <Button icon={<UploadOutlined />} className="bg-blue-500 text-white">
          Change Photo
        </Button>
      </Upload>
    </div>
  );
};

export default GetInfo;
