import axios from "axios";
import { useState, useEffect } from "react";
import { Table, message, Select, Empty, Tag, Card, Typography } from "antd";
import moment from "moment"; // For date formatting
import { Link } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

const BookingStaff = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10); // Default page size
  const [total, setTotal] = useState(0); // Total bookings
  const [bookingStatus, setBookingStatus] = useState("PENDING");

  const getToken = () => localStorage.getItem("token");

  const fetchBookings = async (status, currentPage, pageSize) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(`/v1/bookings/get-by-current-staff`, {
        params: { bookingStatus: status, page: currentPage - 1, size: pageSize },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data.content.map((booking) => ({
        id: booking.id,
        service: booking.service.name,
        email: booking.user.email,
        phone: booking.user.phoneNumber || "N/A",
        address: booking.address,
        bookingDate: booking.startDate,
        status: booking.status,
      }));

      setBookings(data);
      setTotal(response.data.data.totalElements);
    } catch (error) {
      message.error("Failed to fetch bookings.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    let color;
    switch (status) {
      case "PENDING":
        color = "gold";
        break;
      case "CONFIRMED":
        color = "blue";
        break;
      case "IN_PROGRESS":
        color = "purple";
        break;
      case "COMPLETED":
        color = "green";
        break;
      case "CANCELED":
        color = "red";
        break;
      default:
        color = "default";
    }
    return <Tag color={color}>{status}</Tag>;
  };

  useEffect(() => {
    fetchBookings(bookingStatus, page, size);
  }, [bookingStatus, page, size]);

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setSize(pagination.pageSize);
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Link to={`/staff/bookings/booking/${id}`}>{id}</Link>,
    },
    { title: "Service", dataIndex: "service", key: "service" },
    { title: "Customer Email", dataIndex: "email", key: "email" },
    { title: "Customer Phone", dataIndex: "phone", key: "phone" },
    { title: "Customer Address", dataIndex: "address", key: "address" },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
  ];

  return (
    <div className="p-4">
      <Card className="shadow-lg rounded-lg">
        <Title level={3} className="mb-4 text-center">Bookings</Title>
        <div className="flex justify-between items-center mb-4">
          <Select
            defaultValue="PENDING"
            style={{ width: 200 }}
            onChange={(value) => setBookingStatus(value)}
            className="mb-2"
          >
            <Option value="PENDING">Pending</Option>
            <Option value="CONFIRMED">Confirmed</Option>
            <Option value="IN_PROGRESS">In progress</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELED">Canceled</Option>
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={bookings}
          loading={loading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
          }}
          locale={{
            emptyText: bookings.length === 0 && !loading ? (
              <Empty description="No bookings available" />
            ) : undefined,
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default BookingStaff;
