import { useState, useEffect } from "react";
import {
  Table,
  Spin,
  notification,
  Modal,
  Button,
  Tag,
  Dropdown,
  Menu,
} from "antd";
import { DownOutlined, EyeOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import axiosClient from "../../services/config/axios";

const BookingHistory = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBookingsHistory = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get("/v1/bookings/history", {
          params: {
            searchTerm: searchTerm,
            pageIndex: pageIndex, // Chỉnh pageIndex + 1 để phù hợp với API
            pageSize: pageSize,
          },
        });
        const data = response.data;
        setBookingData(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch booking history:", error);
        notification.error({
          message: "Error",
          description: "Failed to load booking history.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsHistory();
  }, [pageIndex, pageSize, searchTerm]);

  const fetchBookingDetails = async (id) => {
    try {
      const response = await axiosClient.get(`/v1/bookings/${id}`);
      setSelectedBooking(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch booking details:", error);
      notification.error({
        message: "Error",
        description: "Failed to load booking details.",
      });
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPageIndex(0); // Reset về trang đầu khi tìm kiếm
  };

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

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Staff Name",
      dataIndex: "staffName",
      key: "staffName",
      render: (staffName) => (
        <Dropdown
          overlay={
            <Menu>
              {staffName && staffName.length > 0 ? (
                staffName.map((name, index) => (
                  <Menu.Item key={index}>{name}</Menu.Item>
                ))
              ) : (
                <Menu.Item key="no-staff">No staff assigned</Menu.Item>
              )}
            </Menu>
          }
          trigger={["click"]}
        >
          <span style={{ cursor: "pointer", color: "#1890ff" }}>
            {staffName && staffName.length > 0 ? staffName[0] : "N/A"}{" "}
            <DownOutlined />
          </span>
        </Dropdown>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        switch (status) {
          case "COMPLETED":
            color = "green";
            break;
          case "PENDING":
            color = "orange";
            break;
          case "CANCELLED":
            color = "red";
            break;
          case "CONFIRMED":
            color = "blue";
            break;
          case "IN_PROGRESS":
            color = "purple";
            break;
          default:
            color = "gray";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <EyeOutlined
          style={{ fontSize: "18px", color: "#1890ff", cursor: "pointer" }}
          onClick={() => fetchBookingDetails(record.id)}
        />
      ),
    },
  ];

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  return (
    <motion.div
      className="container mx-auto py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-center text-gray-600 font-extrabold">
          Booking History
        </h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="bg-white text-gray-700 px-4 py-2 rounded-md shadow-lg border border-gray-300 w-1/3"
        />
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto bg-white rounded-lg shadow-md p-4"
        >
          <Table
            dataSource={bookingData}
            columns={columns}
            pagination={false}
            rowKey="id"
          />

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={pageIndex === 0}
              className="bg-gradient-to-r from-blue-300 to-gray-200 hover:from-gray-300 hover:to-gray-200 text-gray-600 font-bold px-6 py-2 rounded-md cursor-pointer"
            >
              Previous
            </button>
            <span className="text-gray-700 font-semibold">
              Page {pageIndex + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={pageIndex >= totalPages - 1}
              className="bg-gradient-to-r from-blue-300 to-gray-200 hover:from-gray-300 hover:to-gray-200 text-gray-600 font-bold px-6 py-2 rounded-md cursor-pointer"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}

      <Modal
        title="Booking Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {selectedBooking ? (
          <div style={{ padding: "20px", lineHeight: "1.5" }}>
            <div style={{ marginBottom: "16px" }}>
              <strong>Service Name:</strong>
              <p>{selectedBooking.serviceName}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Staff Name:</strong>
              <p>{selectedBooking.staffName}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Start Date:</strong>
              <p>{new Date(selectedBooking.startDate).toLocaleString()}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>End Date:</strong>
              <p>{new Date(selectedBooking.endDate).toLocaleString()}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Address:</strong>
              <p>{selectedBooking.address}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Payment Status:</strong>
              <p>{selectedBooking.payment.paymentStatus}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Payment Method:</strong>
              <p>{selectedBooking.payment.paymentMethod}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Final Price:</strong>
              <p>${selectedBooking.payment.finalPrice.toFixed(2)}</p>
            </div>
          </div>
        ) : (
          <Spin size="large" />
        )}
      </Modal>
    </motion.div>
  );
};

export default BookingHistory;
