import { useState, useEffect } from "react";
import { Table, Spin, notification, Modal, Form, Input, Select } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import axiosClient from "../../services/config/axios";

const { Option } = Select;
const { confirm } = Modal;

const AccountManagement = () => {
  const [accountData, setAccountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAccounts(pageIndex, pageSize, searchTerm);
  }, [pageIndex, pageSize, searchTerm]);

  const fetchAccounts = async (pageIndex, pageSize, searchTerm) => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/v1/users/non-admin", {
        params: { page: pageIndex, size: pageSize, searchTerm }, // Corrected the parameter here
      });
      const data = response.data.content;
      setAccountData(data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to load accounts.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (values) => {
    setLoading(true);
    try {
      await axiosClient.put(`/v1/users/update-role`, {
        roleId: values.role,
        userId: selectedAccount.id,
      });
      notification.success({
        message: "Success",
        description: "Account role updated successfully.",
      });
      fetchAccounts(pageIndex, pageSize, searchTerm);
      handleModalClose();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update account role.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = (id) => {
    confirm({
      title: "Are you sure you want to delete this account?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        setLoading(true);
        try {
          await axiosClient.delete(`/v1/users/delete/${id}`);
          notification.success({
            message: "Success",
            description: "Account deleted successfully.",
          });
          fetchAccounts(pageIndex, pageSize, searchTerm);
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to delete account.",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const openModal = (account = null) => {
    setIsModalVisible(true);
    setIsUpdateMode(!!account);
    setSelectedAccount(account);
    form.setFieldsValue({
      fullName: account?.fullName || "",
      email: account?.email || "",
      role: account?.roleName || "ROLE_USER",
    });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedAccount(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <EditOutlined
            style={{ fontSize: "18px", color: "#1890ff", cursor: "pointer", marginRight: "12px" }}
            onClick={() => openModal(record)}
          />
          <DeleteOutlined
            style={{ fontSize: "18px", color: "#ff4d4f", cursor: "pointer" }}
            onClick={() => handleDeleteAccount(record.id)}
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
    fetchAccounts(0, pageSize, searchTerm); // Fetch accounts with the new search term immediately
  };

  return (
    <motion.div
      className="container mx-auto py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >

      <Input.Search
        placeholder="Search accounts..."
        onChange={handleSearch}
        style={{ marginBottom: 20, width: 300 }}
        allowClear
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            dataSource={accountData}
            columns={columns}
            pagination={false} // Disable built-in pagination
            rowKey="id"
            bordered
          >
          </Table>
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
        </>
      )}

      <Modal
        title={isUpdateMode ? "Update Account Role" : "Add Account"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        onOk={() => {
          form
            .validateFields()
            .then((values) => handleUpdateRole(values))
            .catch((info) => console.error("Validate Failed:", info));
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Full Name" name="fullName">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: "Please select a role!" }]}>
            <Select>
              <Option value="2">ROLE_USER</Option>
              <Option value="3">ROLE_STAFF</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default AccountManagement;
