import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
const Booking = () => {

  const navigate = useNavigate();
  const [durations, setDurations] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [address, setAddress] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [service, setService] = useState(null);
  const { id } = useParams();
  const vnTime = new Date().toLocaleString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });
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
        if (durationsResponse.status === 204) {
          setDurations([]);
        } else if (Array.isArray(durationsResponse.data)) {
          setDurations(durationsResponse.data);
        } else {
          console.warn("Unexpected response format:", durationsResponse.data);
          setDurations([]);
        }

        // Fetch service information
        const serviceResponse = await axiosClient.get(`/v1/services/${id}`);
        if (serviceResponse.status === 200) {
          setService(serviceResponse.data.data);
        } else {
          setService(null); // Clear the service if there's an error
        }

        // Initialize WebSocket connection
        const socket = new SockJS("https://ch-api.arisavinh.dev/ws");
        const stompClientInstance = Stomp.over(socket);
        const jwtToken = localStorage.getItem("token");
        stompClientInstance.connect(
          { Authorization: `Bearer ${jwtToken}` },
          (frame) => {
            setStompClient(stompClientInstance);
          }
        );

        // Cleanup WebSocket connection on unmount
        return () => {
          if (stompClientInstance) stompClientInstance.disconnect();
        };
      } catch (error) {
        console.error(
          "Error during data fetching or WebSocket initialization:",
          error
        );
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Fetch data and initialize WebSocket whenever `id` changes

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
      message.error({
        content: "Please choose location !!!",
        duration: 2,
      });
      return;
    }
    const isoStartTime = new Date(bookingDetails.startTime).toISOString();
    try {
      if (bookingDetails.paymentMethod === "PAYOS") {
        const payOSResponse = await axiosClient.post("/v1/payOS", {
          serviceId: bookingDetails.serviceId,
          durationId: bookingDetails.durationId,
          numberOfWorker: bookingDetails.numberOfWorker,
          address: bookingDetails.address,
          latitude: bookingDetails.latitude,
          longitude: bookingDetails.longitude,
          voucherId: bookingDetails.voucherId || null,
          paymentMethod: bookingDetails.paymentMethod,
          startTime: isoStartTime,
        });
        if (payOSResponse.status === 201 && payOSResponse.data.code === 200) {
          window.location.href = payOSResponse.data.data;
        } else {
          setError("Failed to initiate PayOS payment. Please try again.");
        }
      } else if (bookingDetails.paymentMethod === "CASH"){
        const response = await axiosClient.post("/v1/bookings", {
          serviceId: bookingDetails.serviceId,
          durationId: bookingDetails.durationId,
          numberOfWorker: bookingDetails.numberOfWorker,
          address: bookingDetails.address,
          latitude: bookingDetails.latitude,
          longitude: bookingDetails.longitude,
          voucherId: bookingDetails.voucherId || null,
          paymentMethod: bookingDetails.paymentMethod,
          startTime: isoStartTime,
        });

        const booking = response.data.data;

        const description = `You have a new booking ${booking.id} on ${booking.startedAt} for ${booking.service.name}.`;

        const staff = booking.staff.find(staff => staff.status === true);

        const notificationData = {
          email: staff.email,
          bookingId: booking.id,
          message: description,
          type: 'booking',
          status: 'unread'
        };
        
        const token = localStorage.getItem('token');

        await axiosClient.post(`/v1/notifications`, notificationData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.code === 200 && response.data.status === 1) {
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
      message.error({
        content: error.response?.data?.error ||
        "Failed to process your request. Please try again.",
        duration: 2,
      });
      return;
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

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto py-12 flex space-x-8">
      <Card
        title="Booking Information"
        className="w-3/5 bg-white p-6 rounded-lg shadow-md"
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
              {Array.isArray(durations) && durations.length > 0 ? (
                durations.map((duration) => (
                  <option key={duration.id} value={duration.id}>
                    {duration.durationInHours} hours - {duration.price} vnđ
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No durations available
                </option>
              )}
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
              max={5}
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
              onChange={handleInputChange}
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
              required
            />
          </div>

          <div className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      </Card>
      {/* Service Information Card */}
      <Card
        title={
          <div>
            <Tag color="yellow" className="text-gray-800">
              {service.category.name}
            </Tag>
          </div>
        }
        className="w-2/5 bg-white p-6 rounded-lg shadow-m d"
      >
        <div className="flex">
          {/* Image Section */}
          <div className="w-2/5 pr-4">
            <img
              src={service.img} // Assuming service.imageUrl is the correct image URL
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
              {service.basePrice} vnđ
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Booking;
