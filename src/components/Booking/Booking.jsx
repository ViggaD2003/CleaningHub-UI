import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axiosClient from "../../services/config/axios";
import { toast, ToastContainer } from "react-toastify";
import Mapbox from "../../components/Map/Map";
import 'react-toastify/dist/ReactToastify.css';
import { EnvironmentOutlined, DollarOutlined } from '@ant-design/icons'; // Import from antd
import { Typography, message, Card, Tag, Radio, Button } from "antd";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [durations, setDurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [address, setAddress] = useState(null);
  const [service, setService] = useState(null);

  const [bookingDetails, setBookingDetails] = useState({
    serviceId: parseInt(id, 10),
    durationId: "",
    numberOfWorker: 1,
    address: "",
    voucherId: null,
    paymentMethod: "CASH",
    startTime: "",
  });

  useEffect(() => {
    const fetchDurations = async () => {
      try {
        const response = await axiosClient.get(`/v1/durations/getAll`);
        if (response.status === 204) {
          setDurations([]);
        } else if (Array.isArray(response.data)) {
          setDurations(response.data);
        } else {
          console.warn("Unexpected response format:", response.data);
          setDurations([]);
        }
      } catch (error) {
        console.error("Error fetching durations:", error);
        setError("Failed to load durations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDurations();
  }, [id]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClientInstance = Stomp.over(socket);

    const jwtToken = localStorage.getItem('token');

    stompClientInstance.connect({ Authorization: `Bearer ${jwtToken}` }, (frame) => {
      console.log('Connected: ' + frame);
      setStompClient(stompClientInstance);
    });

    return () => {
      if (stompClientInstance) stompClientInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axiosClient.get(`/v1/services/${id}`);
        if (response.status === 200) {
          console.log("Service response: ", response);
          setService(response.data.data);
          console.log(service);
        }
      } catch (error) {
        message.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (["durationId", "numberOfWorker", "voucherId"].includes(name)) {
      updatedValue = value === "" ? "" : parseInt(value, 10);
    }

    setBookingDetails({ ...bookingDetails, [name]: updatedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !bookingDetails.durationId ||
      !bookingDetails.address ||
      !bookingDetails.startTime
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const isoStartTime = new Date(bookingDetails.startTime).toISOString();
    const payload = {
      ...bookingDetails,
      startTime: isoStartTime,
    };

    console.log("Submitting Booking Payload:", payload);

    try {
      if (bookingDetails.paymentMethod === "PAYOS") {
        const payOSResponse = await axiosClient.post("/v1/payOS", {
          serviceId: bookingDetails.serviceId,
          durationId: bookingDetails.durationId,
          numberOfWorker: bookingDetails.numberOfWorker,
          address: bookingDetails.address,
          voucherId: bookingDetails.voucherId || null,
          paymentMethod: bookingDetails.paymentMethod,
          startTime: isoStartTime,
        });

        console.log("PayOS Response:", payOSResponse);

        if (payOSResponse.status === 201 && payOSResponse.data.code === 200) {
          window.location.href = payOSResponse.data.data;
        } else {
          setError("Failed to initiate PayOS payment. Please try again.");
        }
      } else {
        const response = await axiosClient.post("/v1/bookings", payload);
        console.log("Booking Response:", response);

        if (response.status === 201 || response.status === 200) {
          stompClient.send("/app/notifications", {}, JSON.stringify(response.data.data));
          navigate("/booking-success");
        } else {
          setError("Failed to create booking. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to process your request. Please try again.";

      toast.error(errorMessage);
    }
  };

  const handleSelectedAddress = (location) => {
    console.log(location.address);
    setAddress(location.address);
    console.log(location.address);
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      address: location.address,
    }));
    setShowMap(true);
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto py-12 flex space-x-8">
  {/* Booking Information Card */}
  <Card
    title="Booking Information"
    className="w-3/5 bg-white p-6 rounded-lg shadow-md"
  >
    <section className="text-center mb-6">
      <div className="mb-4 relative inline-block">
        <label className="block text-gray-700 font-bold mb-2">Address:</label>
        <div className="flex items-center border p-2 rounded w-80 mx-auto">
          <Typography.Text
            className="w-full border-none outline-none"
            onClick={toggleMap}
            style={{ cursor: 'pointer' }}
          >
            {address || 'Click on the map icon to select an address'}
          </Typography.Text>
          <EnvironmentOutlined
            className="ml-2 cursor-pointer text-blue-500"
            style={{ fontSize: '24px' }}
            onClick={toggleMap}
          />
        </div>
        {showMap && (
          <div className="mt-2">
            <Mapbox onSelectedAddress={handleSelectedAddress} />
          </div>
        )}
      </div>
    </section>

    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Select Duration:</label>
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
            <option value="" disabled>No durations available</option>
          )}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Number of Workers:</label>
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
        <label className="block text-gray-700 font-bold mb-2">Payment Method:</label>
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
        <label className="block text-gray-700 font-bold mb-2">Start Time:</label>
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
    <ToastContainer />
  </Card>

  {/* Service Information Card */}
  <Card
    title={
      <div>
        <Tag color="yellow" className="text-gray-800">{service.category.name}</Tag>
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
