import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../services/config/axios";

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

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

  return (
    <div className="container mx-auto py-12">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[400px] mb-12 flex justify-center items-center"
        style={{ backgroundImage: `url(${service.img || "path_to_default_image"})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="relative text-white text-4xl font-bold">{service.name}</h1>
      </div>

      {/* Features Section (Description) */}
      <div className="text-center mb-12">
        <h2 className="text-xl font-bold mb-4">Service Description</h2>
        <p className="text-gray-600">{service.description}</p>
      </div>

      {/* Pricing Section */}
      <div className="text-center mb-12">
        <h2 className="text-xl font-bold mb-4">Service Pricing</h2>
        <div className="flex justify-center">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
            <h4 className="text-lg font-bold mb-2">Basic Package</h4>
            <p className="text-xl font-bold">${service.basePrice}</p>
          </div>
        </div>
      </div>

      {/* Booking Button */}
      <div className="text-center">
        <button className="bg-yellow-500 text-white px-8 py-4 rounded-md hover:bg-yellow-600">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ServiceDetail;