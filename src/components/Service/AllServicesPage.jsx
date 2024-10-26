import { useState, useEffect } from "react";
import axiosClient from "../../services/config/axios";
import image from "../../assets/image/image.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AllServicesPage = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosClient.get("/v1/services/available");
        if (Array.isArray(response.data.data.content)) {
          const servicesByCategory = groupByCategory(response.data.data.content);
          setServices(servicesByCategory);
        } else {
          console.error("Expected an array in 'content', but got:", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const groupByCategory = (services) => {
    return services.reduce((acc, service) => {
      const categoryName = service.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(service);
      return acc;
    }, {});
  };

  const handleServiceClick = (id) => {
    navigate(`/services/${id}`);
  };

  return (
    <motion.div className="container mx-auto py-12"
     initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold text-gray-800">All Services</h2>
        <p className="text-gray-600 mt-2">Explore our wide range of available services.</p>
      </div>
      {Object.keys(services).map((category) => (
        <div key={category} className="mb-12">
          <h3 className="text-2xl font-medium mb-6 text-gray-700">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {services[category].map((service) => (
              <div
                key={service.id}
                className="p-6 rounded-lg bg-white shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="mb-4">
                  <img
                    src={service.img || image}
                    alt={service.name}
                    className="w-full h-40 object-cover rounded-md shadow-sm"
                  />
                </div>
                <h3 className="font-semibold text-xl text-gray-800">{service.name}</h3>
                <p className="text-gray-500 mt-3 line-clamp-2">{service.description}</p>
                <p className="text-gray-900 font-semibold mt-3">${service.basePrice}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default AllServicesPage;
