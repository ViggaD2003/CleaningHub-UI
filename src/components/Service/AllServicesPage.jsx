import { useState, useEffect } from "react";
import axiosClient from "../../services/config/axios";
import image from "../../assets/image/image.png";
import { useNavigate } from "react-router-dom";

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
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">All Services</h2>
      </div>
      {Object.keys(services).map((category) => (
        <div key={category} className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {services[category].map((service) => (
              <div
                key={service.id}
                className="p-6 border rounded-lg"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="mb-4">
                  <img
                    src={service.img || image}
                    alt={service.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-bold text-lg">{service.name}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
                <p className="text-gray-800 font-bold mt-2">${service.basePrice}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllServicesPage;
