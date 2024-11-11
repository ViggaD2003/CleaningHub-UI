import { useState, useEffect } from "react";
import axiosClient from "../../services/config/axios";
import image from "../../assets/image/image.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AllServicesPage = () => {
  const [services, setServices] = useState([]);
  const [pageIndex, setPageIndex] = useState(0); // Trang hiện tại
  const [pageSize] = useState(12); // Số mục trên mỗi trang
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosClient.get("/v1/services/available", {
          params: {
            pageIndex,
            pageSize,
          },
        });
        
        if (Array.isArray(response.data.data.content)) {
          const servicesByCategory = groupByCategory(response.data.data.content);
          setServices(servicesByCategory);
          setTotalPages(response.data.data.totalPages); // Lưu tổng số trang từ API
        } else {
          console.error("Expected an array in 'content', but got:", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [pageIndex]); // Gọi lại API khi pageIndex thay đổi

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

  const handlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
  };

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) setPageIndex(pageIndex + 1);
  };

  return (
    <motion.div
      className="container mx-auto py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold text-gray-800">All Services</h2>
        <p className="text-gray-600 mt-2">Explore our wide range of available services.</p>
      </div>
      {Object.keys(services).map((category) => (
        <motion.div
      className="container mx-auto py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
     key={category} className="mb-12">
          <h3 className="text-2xl font-medium mb-6 text-gray-700">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {services[category].map((service) => (
              <div
                key={service.id}
                className="p-6 rounded-lg bg-slate-200 shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
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
                <p className="text-gray-900 font-semibold mt-3">{service.basePrice} vnđ</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Phân trang */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handlePreviousPage}
          disabled={pageIndex === 0}
          className="bg-gradient-to-r from-blue-300 to-gray-200 hover:from-gray-300 hover:to-gray-200 text-gray-600 font-bold px-6 py-2 rounded-md cursor-pointer"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {pageIndex + 1} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={pageIndex === totalPages - 1}
          className="bg-gradient-to-r from-blue-300 to-gray-200 hover:from-gray-300 hover:to-gray-200 text-gray-600 font-bold px-6 py-2 rounded-md cursor-pointer"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default AllServicesPage;
