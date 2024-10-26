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

const Booking = () => {
  
  const navigate = useNavigate();
  const [durations, setDurations] = useState([]);
  const [vourchers, setVourchers] = useState([]);
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
        // Fetch durations
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
        const socket = new SockJS("http://localhost:8080/ws");
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
    const { name, value } = e.target;
    let updatedValue = value;
    if (["durationId", "numberOfWorker", "voucherId"].includes(name)) {
      updatedValue = value === "" ? "" : parseInt(value, 10);
    }
    e.target.blur();

    setBookingDetails({ ...bookingDetails, [name]: updatedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(bookingDetails);

    if (
      (bookingDetails.latitude === 0 &&
        bookingDetails.latitude === 0 &&
        bookingDetails.address === "") ||
      (!bookingDetails.latitude &&
        !bookingDetails.latitude &&
        !bookingDetails.address)
    ) {
      console.log(bookingDetails.latitude);
      message.error({
        content: "Please choose location !!!",
        duration: 2,
      });
      return;
    }

    console.log(bookingDetails.latitude);

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
      } else {
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
                    {duration.durationInHours} hours - ${duration.price}
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

          {/* <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
              Select voucherId:
            </label>
            <select
              name="durationId"
              value={bookingDetails.voucherId}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Select Duration</option>
              {Array.isArray(durations) && durations.length > 0 ? (
                durations.map((duration) => (
                  <option key={duration.id} value={duration.id}>
                    {duration.durationInHours} hours - ${duration.price}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No durations available
                </option>
              )}
            </select>
          </div> */}

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
        className="w-2/5 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex">
          {/* Image Section */}
          <div className="w-2/5 pr-4">
            <img
              src={service.imageUrl} // Assuming service.imageUrl is the correct image URL
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
    </div>
  );
};

export default Booking;
