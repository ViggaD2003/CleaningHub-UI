import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axiosClient from "../../services/config/axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  

const Booking = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [durations, setDurations] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [stompClient, setStompClient] = useState(null);

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
    const socket = new SockJS('http://localhost:8080/ws'); // Connect to WebSocket endpoint
    const stompClientInstance = Stomp.over(socket);

    const jwtToken = localStorage.getItem('token');
    
    stompClientInstance.connect({ Authorization: `Bearer ${jwtToken}` }, (frame) => {
      console.log('Connected: ' + frame);
      setStompClient(stompClientInstance);  // Set the stompClient instance in the state
    });

    return () => {
      if (stompClientInstance) stompClientInstance.disconnect();
    };
  }, []);
  
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
      
      toast.error(errorMessage); // Show error message using toast
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-center text-3xl font-bold mb-8">Book Service</h1>
      <form onSubmit={handleSubmit}>
        {/* Select Duration */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Select Duration:
          </label>
          <select
            name="durationId"
            value={bookingDetails.durationId}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
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

        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Address:
          </label>
          <input
            type="text"
            name="address"
            value={bookingDetails.address}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
            placeholder="Enter your address"
          />
        </div>

        {/* Number of Workers */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Number of Workers:
          </label>
          <input
            type="number"
            name="numberOfWorker"
            value={bookingDetails.numberOfWorker}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
            min="1"
            placeholder="Enter number of workers"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Payment Method:
          </label>
          <select
            name="paymentMethod"
            value={bookingDetails.paymentMethod}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="CASH">CASH</option>
            <option value="PAYOS">PAYOS</option>
          </select>
        </div>

        {/* Start Time */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Start Time:
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={bookingDetails.startTime}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-8 py-4 rounded-md hover:bg-blue-600"
          >
            Confirm Booking
          </button>
        </div>
      </form>

      {/* Toast Container for showing toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default Booking;
