import { useState, useEffect } from "react";
import {Table,Spin,notification,Modal,Button,Form,Input,Select,Image,Upload,message,} from "antd";
import {EditOutlined,DeleteOutlined,PlusOutlined,ExclamationCircleOutlined,UploadOutlined,} from "@ant-design/icons";
import { motion } from "framer-motion";
import axiosClient from "../../services/config/axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../services/config/firebase";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;
const { confirm } = Modal;

const ServiceManagement = () => {
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);  
  const [uploadedImageURL, setUploadedImageURL] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get("/v1/categories/getAll", {
          params: {
            page: 0,
            size: 100,
          },
        });
        setCategories(response.data.content);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        notification.error({
          message: "Error",
          description: "Failed to load categories.",
        });
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    getAllServices(pageIndex, pageSize, searchTerm);
  }, [pageIndex, pageSize, searchTerm]);

  const getAllServices = async (pageIndex, pageSize, searchTerm) => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/v1/services/available", {
        params: {
          pageIndex,
          pageSize,
          searchTerm: searchTerm || "",
        },
      });

      if (response.data.status === 1 && response.data.code === 200) {
        const data = response.data.data;
        setServiceData(data.content);
        setTotalPages(data.totalPages);
      } else {
        throw new Error(response.data.message || "Failed to load services.");
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to load services.";
      notification.error({
        message: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle create or update service
  const handleCreateOrUpdate = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        categoryId: values.categoryId,
        img: uploadedImageURL || (selectedService ? selectedService.img : ""),
      };

      if (isUpdateMode) {
        await axiosClient.put(`/v1/services/${selectedService.id}`, payload);
        notification.success({
          message: "Success",
          description: "Service updated successfully.",
        });
      } else {
        await axiosClient.post("/v1/services", payload);
        notification.success({
          message: "Success",
          description: "Service created successfully.",
        });
      }
      getAllServices(pageIndex, pageSize, searchTerm);
      handleModalClose();
    } catch (error) {
      console.error("Failed to save service:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to save service.";
      notification.error({
        message: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a service with confirmation
  const handleDeleteService = (id) => {
    confirm({
      title: "Are you sure you want to delete this service?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        setLoading(true);
        try {
          await axiosClient.delete(`/v1/services/${id}`);
          notification.success({
            message: "Success",
            description: "Service deleted successfully.",
          });
          getAllServices(pageIndex, pageSize, searchTerm);
        } catch (error) {
          console.error("Failed to delete service:", error);
          const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to delete service.";
          notification.error({
            message: "Error",
            description: errorMessage,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Function to open modal for create or update
  const openModal = (service = null) => {
    setIsModalVisible(true);
    setIsUpdateMode(!!service);
    setSelectedService(service);
    if (service) {
      setUploadedImageURL(service.img || "");
      form.setFieldsValue({
        name: service.name,
        description: service.description,
        basePrice: service.basePrice,
        status: service.status,
        img: service.img,
        categoryId: service.category.id,
      });
    } else {
      setUploadedImageURL("");
      form.resetFields();
    }
  };

  // Function to close modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedService(null);
    form.resetFields();
    setUploadedImageURL("");
  };

  const handleUpload = async (info) => {
    const file = info.file;
    setUploading(true);
    try {
      const imgRef = ref(storage, `file/${uuidv4()}`);
      await uploadBytes(imgRef, file);
      const downloadURL = await getDownloadURL(imgRef);
      setUploadedImageURL(downloadURL);
      form.setFieldsValue({ img: downloadURL }); // Auto-fill the img field
      await axiosClient.patch(`/v1/services/update-img-service/${selectedService.id}`, downloadURL)
      message.success("Image uploaded successfully.");
    } catch (error) {
      message.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // Define columns for the table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Base Price",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (price) => `$${price.toLocaleString()}`,
      sorter: (a, b) => a.basePrice - b.basePrice,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <span
          className={status === "active" ? "text-green-600" : "text-red-600"}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      sorter: (a, b) => a.category.name.localeCompare(b.category.name),
    },
    {
      title: "Image",
      dataIndex: "img",
      key: "img",
      render: (img) =>
        img ? (
          <Image
            width={50}
            src={img}
            alt="Service Image"
            placeholder={<Spin />}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <EditOutlined
            style={{
              fontSize: "18px",
              color: "#1890ff",
              cursor: "pointer",
              marginRight: "12px",
            }}
            onClick={() => openModal(record)}
          />
          <DeleteOutlined
            style={{
              fontSize: "18px",
              color: "#ff4d4f",
              cursor: "pointer",
            }}
            onClick={() => handleDeleteService(record.id)}
          />
        </>
      ),
    },
  ];

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    setPageIndex(0);
    getAllServices(0, pageSize, searchTerm); 
  };

  return (
    <motion.div
      className="container mx-auto py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center text-amber-500">
          Service Management
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Add Service
        </Button>
      </div>

      <Input.Search
        placeholder="Search services..."
        onChange={handleSearch}
        style={{ marginBottom: 20, width: 300 }}
        allowClear
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
          <Table
            dataSource={serviceData}
            columns={columns}
            pagination={false}
            rowKey="id"
            bordered
          />

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={pageIndex === 0}
              className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-md shadow-lg duration-300 disabled:opacity-50 hover:from-yellow-400 hover:to-pink-500"
            >
              Previous
            </button>
            <span className="text-gray-700 font-semibold">
              Page {pageIndex + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={pageIndex >= totalPages - 1}
              className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-md shadow-lg duration-300 disabled:opacity-50 hover:from-yellow-400 hover:to-pink-500"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <Modal
        title={isUpdateMode ? "Update Service" : "Create Service"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            loading={uploading}
          >
            {isUpdateMode ? "Update" : "Create"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the service name!" },
            ]}
          >
            <Input placeholder="Service Name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Service Description" />
          </Form.Item>
          <Form.Item
            label="Base Price"
            name="basePrice"
            rules={[
              { required: true, message: "Please input the base price!" },
            ]}
          >
            <Input type="number" placeholder="Base Price" min="0" />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[
              { required: true, message: "Please input the service status!" },
            ]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Image"
            name="img"
            rules={[
              { type: "url", message: "Please enter a valid URL!" },
              { required: true, message: "Please upload an image!" }, 
            ]}
          >
            <Input placeholder="Service Image URL" readOnly />
          </Form.Item>
          <Form.Item label="Upload Image">
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleUpload}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                Click to Upload
              </Button>
            </Upload>
            {uploadedImageURL && (
              <Image
                src={uploadedImageURL}
                alt="Uploaded Image"
                width={100}
                style={{ marginTop: 10 }}
              />
            )}
          </Form.Item>
          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select category">
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default ServiceManagement;
