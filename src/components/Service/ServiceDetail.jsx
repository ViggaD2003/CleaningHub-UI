import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../services/config/axios";
import image from "../../assets/image/image.png";
import { motion } from "framer-motion";

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axiosClient.get(`/v1/services/${id}`);
        setService(response.data.data);
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };

    fetchServiceDetails();
  }, [id]);

  if (!service) {
    return <p>Loading...</p>;
  }

  const handleBookNow = () => {
    navigate(`/bookings/${id}`); // Điều hướng tới trang booking
  };

  return (
    <motion.div className="flex justify-center py-24"
    initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div
        className="shadow-gray-400 bg-slate-200  rounded-lg shadow-lg p-6 w-full max-w-screen-2xl flex flex-col md:flex-row"
        style={{ height: "800px" }}
      >
        {/* Image Section - Left */}
        <div className="md:w-1/2 mb-6 md:mb-0 md:mr-6">
          <div className="rounded-lg overflow-hidden w-full h-full flex items-center justify-center">
            <img
              src={image}
              className="w-full h-full object-cover"
              alt="Service"
            />
          </div>
        </div>

        {/* Information Section - Right */}
        <div className="md:w-1/2 flex flex-col justify-start"> {/* Aligns content to the top */}
          <div className="space-y-6">
            {/* Service Name */}
            <div className="text-center"> {/* Aligned text to the left */}
              <h1 className="text-3xl font-bold text-gray-700 mb-4">
                {service.name}
              </h1>
            </div>

            {/* Description Section */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Description
              </h2>
              <p className="text-gray-800 text-xl font-bold">
                {service.description}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Basic Package
              </h2>
              <p className="text-gray-800 text-xl font-bold">
                ${service.basePrice}
              </p>
            </div>

            {/* Booking Button */}
            <div className="text-center mt-4"> {/* Moved the button to the left */}
              <button
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-extrabold py-3 px-6 rounded-lg transition duration-300"
                onClick={handleBookNow}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceDetail;
