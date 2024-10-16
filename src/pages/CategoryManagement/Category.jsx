import { useState, useEffect } from "react";
import { Table, Spin, notification, Modal, Button, Form, Input } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import axiosClient from "../../services/config/axios";

const CategoryManagement = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const fetchCategories = async (pageIndex, pageSize) => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/v1/categories/getAll", {
        params: {
          page: pageIndex,
          size: pageSize,
        },
      });
      const data = response.data;
      setCategoryData(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      notification.error({
        message: "Error",
        description: "Failed to load categories.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (values) => {
    setLoading(true);
    try {
      if (isUpdateMode) {
        await axiosClient.put(`/v1/categories/update/${selectedCategory.id}`, values);
        notification.success({
          message: "Success",
          description: "Category updated successfully.",
        });
      } else {
        await axiosClient.post("/v1/categories/create", values);
        notification.success({
          message: "Success",
          description: "Category created successfully.",
        });
      }
      fetchCategories(pageIndex, pageSize);
      handleModalClose();
    } catch (error) {
      console.error("Failed to save category:", error);
      notification.error({
        message: "Error",
        description: "Failed to save category.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axiosClient.delete(`/v1/categories/delete/${id}`);
      notification.success({
        message: "Success",
        description: "Category deleted successfully.",
      });
      fetchCategories(pageIndex, pageSize);
    } catch (error) {
      console.error("Failed to delete category:", error);
      notification.error({
        message: "Error",
        description: "Failed to delete category.",
      });
    }
  };

  const openModal = (category = null) => {
    setIsModalVisible(true);
    setIsUpdateMode(!!category);
    setSelectedCategory(category);
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCategory(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <EditOutlined
            style={{ fontSize: '18px', color: '#1890ff', cursor: 'pointer', marginRight: '12px' }}
            onClick={() => openModal(record)}
          />
          <DeleteOutlined
            style={{ fontSize: '18px', color: '#ff4d4f', cursor: 'pointer' }}
            onClick={() => handleDeleteCategory(record.id)}
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

  return (
    <motion.div
      className="container mx-auto py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center text-amber-500">Category Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Add Category
        </Button>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
          <Table
            dataSource={categoryData}
            columns={columns}
            pagination={false}
            rowKey="id"
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
        title={isUpdateMode ? "Update Category" : "Create Category"}
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
          >
            {isUpdateMode ? "Update" : "Create"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrUpdate}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the category name!" }]}
          >
            <Input placeholder="Category Name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea placeholder="Category Description" />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default CategoryManagement;
