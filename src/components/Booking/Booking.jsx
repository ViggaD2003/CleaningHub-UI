import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axiosClient from "../../services/config/axios";
import { toast, ToastContainer } from "react-toastify";
import Mapbox from "../../components/Map/Map";
import "react-toastify/dist/ReactToastify.css";
import { DollarOutlined } from "@ant-design/icons";
import { message, Card, Tag, Radio, Button } from "antd";
import icon from "../../assets/image/images-removebg-preview.png";
import { Select } from "antd";
import { WebSocketContext } from "../../services/config/provider/WebSocketProvider";
import { motion } from "framer-motion";
import image from "../../assets/image/image.png";
import "./Button.css"


const Booking = () => {
  const { stompClient } = useContext(WebSocketContext)
  const navigate = useNavigate();
  const [durations, setDurations] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [service, setService] = useState(null);
  const { id } = useParams();
  const vnTime = new Date().toLocaleString("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  const [date, time] = vnTime.split(", ");
  const formattedDateTime = `${date}T${time.slice(0, 5)}`;
  const [bookingDetails, setBookingDetails] = useState({
    serviceId: parseInt(id, 10),
    durationId: 1,
    numberOfWorker: 1,
    longitude: 0,
    latitude: 0,
    address: "",
    voucherId: null,
    paymentMethod: "CASH",
    startTime: formattedDateTime,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const voucherResponse = await axiosClient.get("/v1/vouchers");
        setVouchers(voucherResponse.data.data || []);

        const durationsResponse = await axiosClient.get(`/v1/durations/getAll`);
        setDurations(durationsResponse.data || []);

        const serviceResponse = await axiosClient.get(`/v1/services/${id}`);
        setService(serviceResponse.data.data);
console.log(serviceResponse.data.data);

      } catch (error) {
        console.error("Error during data fetching:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target || e;
    let updatedValue = value;
    if (["durationId", "numberOfWorker", "voucherId"].includes(name)) {
      updatedValue = value === "" ? null : parseInt(value, 10);
    }

    setBookingDetails({ ...bookingDetails, [name]: updatedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      (bookingDetails.latitude === 0 &&
        bookingDetails.latitude === 0 &&
        bookingDetails.address === "") ||
      (!bookingDetails.latitude &&
        !bookingDetails.latitude &&
        !bookingDetails.address)
    ) {
      message.error("Please choose location !!!", 2);
      return;
    }

    const isoStartTime = new Date(bookingDetails.startTime).toISOString();
    try {
      const bookingData = {
        serviceId: bookingDetails.serviceId,
        durationId: bookingDetails.durationId,
        numberOfWorker: bookingDetails.numberOfWorker,
        address: bookingDetails.address,
        latitude: bookingDetails.latitude,
        longitude: bookingDetails.longitude,
        voucherId: bookingDetails.voucherId || null,
        paymentMethod: bookingDetails.paymentMethod,
        startTime: isoStartTime,
      };

      if (bookingDetails.paymentMethod === "PAYOS") {
        const payOSResponse = await axiosClient.post("/v1/payOS", bookingData);
        if (payOSResponse.status === 201 && payOSResponse.data.code === 200) {
          window.location.href = payOSResponse.data.data;
        } else {
          setError("Failed to initiate PayOS payment. Please try again.");
        }
      } else {
        const response = await axiosClient.post("/v1/bookings", bookingData);
        if (response.status === 201 || response.status === 200) {
          stompClient.send(
            "/app/notifications",
            {},
            JSON.stringify(response.data.data)
          );
          navigate("/booking-success");
        } else {
          setError("Failed to create booking. Please try again.");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Failed to process your request. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleSelectedAddress = (location) => {
    setAddress(location.address);
    setLongitude(location.longitude);
    setLatitude(location.latitude);
    setBookingDetails({
      ...bookingDetails,
      address: location.address,
      longitude: location.longitude,
      latitude: location.latitude,
    });
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (

    
    <motion.div className="container mx-auto py-12 flex space-x-8"
    initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Card
        title="Booking Information"
        className="w-3/5 bg-slate-200 p-6 rounded-lg shadow-md"
      >
        <section className="text-center mb-6">
          <div className="mt-2">
            <Mapbox onSelectedAddress={handleSelectedAddress} />
          </div>
        </section>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Select Duration:
            </label>
            <select
              name="durationId"
              value={bookingDetails.durationId}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Select Duration</option>
              {durations.map((duration) => (
                <option key={duration.id} value={duration.id}>
                  {duration.durationInHours} hours - ${duration.price}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Number of Workers:
            </label>
            <input
              type="number"
              name="numberOfWorker"
              value={bookingDetails.numberOfWorker}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              required
              min="1"
              placeholder="Enter number of workers"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Payment Method:
            </label>
            <Radio.Group
              name="paymentMethod"
              value={bookingDetails.paymentMethod}
              onChange={(e) =>
                handleInputChange({ name: "paymentMethod", value: e.target.value })
              }
              className="w-full"
            >
              <Radio value="CASH">CASH</Radio>
              <Radio value="PAYOS">PAYOS</Radio>
            </Radio.Group>
          </div>

          <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Select Voucher:
        </label>
        <Select
          placeholder="Select Voucher"
          value={bookingDetails.voucherId}
          onChange={(value) =>
            handleInputChange({ name: "voucherId", value: value })
          }
          className="w-full"
        >
          {vouchers.map((voucher) => (
            <Option key={voucher.id} value={voucher.id}>
              <div className="flex items-center">
                <img
                  src={icon}
                  alt="Voucher Icon"
                  style={{ width: "20px", marginRight: "8px" }}
                />
                <span>{voucher.percentage}% - left {voucher.amount}</span>
              </div>
            </Option>
          ))}
        </Select>
      </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Start Time:
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={bookingDetails.startTime}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div className="text-center mt-6">
            <Button
              htmlType="submit"
              icon={<DollarOutlined />}
              loading={loading}
              className="custom-button"
            >
              Book Now
            </Button>
          </div>
        </form>
      </Card>

      <Card
        title={
          <div>
            <Tag color="yellow" className="text-gray-800">
              {service.category.name}
            </Tag>
          </div>
        }
        className="w-2/5 size-min bg-slate-200 p-6 rounded-lg shadow-md"
      >
        <div className="flex">
          {/* Image Section */}
          <div className="w-2/5 pr-4">
            <img
              src={service.img || image} // Assuming service.imageUrl is the correct image URL
              alt={service.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
          {/* Content Section */}
          <div className="w-3/5">
            <h2 className="text-xl font-bold mb-2">{service.name}</h2>
            <p className="mb-4 text-gray-600">{service.description}</p>
            <p className="text-lg font-semibold">
              <DollarOutlined className="mr-2 text-green-600" />
              {service.basePrice} $
            </p>
          </div>
        </div>
      </Card>
      <ToastContainer />
    </motion.div>
  );
};

export default Booking;
