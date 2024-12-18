import { Card, message, Spin, Col, Row, Tag, Button } from "antd";
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  UserOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { WebSocketContext } from "../../services/config/provider/WebSocketProvider";
import axiosClient from "../../services/config/axios";

const BookingDetailStaff = () => {
  const { stompClient } = useContext(WebSocketContext);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { id } = location.state || {};

 

  useEffect(() => {
    const fetchBooking = async (bookingId) => {
        setLoading(true);
        try {
          const response = await axiosClient.get(`v1/bookings/staff/${bookingId}`);
          setBooking(response.data.data);
        } catch (error) {
          message.error("Failed to fetch booking details.");
        } finally {
          setLoading(false);
        }
      };

    fetchBooking(id);
  }, [id]);

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (!booking) {
    return <p>No booking data available.</p>;
  }

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
    return (
      <Tag color={color} className="text-sm">
        {status}
      </Tag>
    );
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString(); // Format as 'MM/DD/YYYY' or as per locale
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // Format as 'HH:MM AM/PM'
    return { formattedDate, formattedTime };
  };

  const updateStatus = async (bookingId, currentStatus) => {
    let newStatus;
    switch (currentStatus) {
      case "PENDING":
        newStatus = "CONFIRMED";
        break;
      case "CONFIRMED":
        newStatus = "IN_PROGRESS";
        break;
      case "IN_PROGRESS":
        newStatus = "COMPLETED";
        break;
      default:
        return;
    }

    try {
      await axiosClient.patch(
        `/v1/bookings/update-booking-status?status=${newStatus}&bookingId=${bookingId}`
      );

      const updatedBooking = { ...booking, status: newStatus };
      setBooking(updatedBooking);

      message.success("Booking status updated successfully!");

      const description = `
                            Your booking ${booking.id} is now ${newStatus}. Please feel free to share your feedback about
                            our service ${booking.service.name} and staff ${booking.staff.firstName} ${booking.staff.lastName}.
                    `;

      const notificationData = {
        email: booking.user.email,
        bookingId: booking.id,
        message: description,
        type: newStatus === "COMPLETED" ? "feedback" : "readonly",
        status: "unread",
      };
      await axiosClient.post(`/v1/notifications`, notificationData);

      stompClient.send("/app/feedbacks", {}, JSON.stringify(updatedBooking));
    } catch (error) {
      message.error("Failed to update booking status.");
      console.error(error);
    }
  };

  const { service, address, duration, endDate, startDate, user } = booking;
  const { payment } = booking.bookingDetailResponseDto;

  const startTime = formatDateTime(startDate);
  const endTime = formatDateTime(endDate);

  const wage = duration.price + service.basePrice;

  return (
    <div className="p-5">
      <Row gutter={24}>
        {/* Left Column - Booking, Service, and User Information */}
        <Col span={16}>
          <Card className="mb-5 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <HomeOutlined className="mr-2" /> Booking Information
            </h2>
            <div className="border-b-2 border-dashed pb-4 mb-4">
              <p className="text-lg font-semibold">
                Booking ID:{" "}
                <span className="text-xl font-bold text-blue-600">
                  {booking.id}
                </span>
              </p>
              <p className="text-lg font-semibold">
                Address: <span className="text-md">{address}</span>
              </p>
              <p className="text-lg font-semibold">
                Booking Status: {getStatusTag(booking.status)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <CalendarOutlined className="text-blue-500 mr-2" />
                <span className="font-semibold">Start Date:</span>
                <span className="ml-2">{startTime.formattedDate}</span>
              </div>
              <div className="flex items-center">
                <ClockCircleOutlined className="text-green-500 mr-2" />
                <span className="font-semibold">Start Time:</span>
                <span className="ml-2">{startTime.formattedTime}</span>
              </div>
              <div className="flex items-center mt-2">
                <CalendarOutlined className="text-blue-500 mr-2" />
                <span className="font-semibold">End Date:</span>
                <span className="ml-2">{endTime.formattedDate}</span>
              </div>
              <div className="flex items-center mt-2">
                <ClockCircleOutlined className="text-green-500 mr-2" />
                <span className="font-semibold">End Time:</span>
                <span className="ml-2">{endTime.formattedTime}</span>
              </div>
            </div>
          </Card>

          <Card className="mb-5 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <DollarCircleOutlined className="mr-2" /> Service Information
            </h2>
            <div className="border-b-2 border-dashed pb-4 mb-4">
              <p className="text-lg font-semibold">
                Name:{" "}
                <span className="text-xl font-bold text-green-600">
                  {service?.name}
                </span>
              </p>
              <p className="text-lg font-semibold">
                Description:{" "}
                <span className="text-md">{service?.description}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Base Price:</p>
                <p className="text-md">{service?.basePrice} USD</p>
              </div>
              <div>
                <p className="font-semibold">Category:</p>
                <p className="text-md">{service?.category?.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="font-semibold">Duration Price:</p>
                <p className="text-md">{duration.price}</p>
              </div>
            </div>
          </Card>

          <Card className="shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <UserOutlined className="mr-2" /> Customer Information
            </h2>
            <div className="border-b-2 border-dashed pb-4 mb-4">
              <p className="text-lg font-semibold">
                Email: <span className="text-md">{user?.email}</span>
              </p>
              <p className="text-lg font-semibold">
                Phone:{" "}
                <span className="text-md">{user?.phoneNumber || "N/A"}</span>
              </p>
            </div>
            <p className="text-lg font-semibold">
              Status:{" "}
              <span className="text-md">
                {user?.status ? "Active" : "Inactive"}
              </span>
            </p>
          </Card>
        </Col>

        {/* Right Column - Payment Information */}
        <Col span={8}>
          <Card className="shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <DollarCircleOutlined className="mr-2" /> Payment Information
            </h2>
            <div className="border-b-2 border-dashed pb-4 mb-4">
              <p className="text-lg font-semibold">
                Total Price:{" "}
                <span className="text-xl font-bold text-red-600">
                  {payment?.finalPrice} USD
                </span>
              </p>
              <p className="text-lg font-semibold">
                Your Wage:{" "}
                <span className="text-xl font-bold text-green-600">
                  {wage} USD
                </span>
              </p>
            </div>
            <p className="text-lg font-semibold">
              Status: {getStatusTag(payment?.paymentStatus)}
            </p>
            <p className="text-lg font-semibold mt-2">
              Method: <span className="text-md">{payment?.paymentMethod}</span>
            </p>
          </Card>
          <Button
            type="primary"
            onClick={() => updateStatus(booking.id, booking.status)}
            disabled={
              booking.status === "COMPLETED" || booking.status === "CANCELLED"
            }
          >
            {booking.status === "PENDING"
              ? "Confirm"
              : booking.status === "CONFIRMED"
              ? "Start"
              : booking.status === "IN_PROGRESS"
              ? "Complete"
              : "Completed"}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default BookingDetailStaff;
