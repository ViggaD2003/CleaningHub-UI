import { useState, useEffect } from "react";
import axiosClient from "../../services/config/axios";
import image from "../../assets/image/image.png";
import { useNavigate } from "react-router-dom";
import homepage1 from "../../assets/image/homepage1.jpg";
import homepage2 from "../../assets/image/homepage2.jpg";
import video from "../../assets/image/video.mp4";
import { motion } from "framer-motion";

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [topStaff, setTopStaff] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosClient.get("/v1/services/available");
        if (Array.isArray(response.data.data.content)) {
          const shuffledServices = response.data.data.content
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
          setServices(shuffledServices);
        } else {
          console.error(
            "Expected an array in 'content', but got:",
            response.data.data
          );
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchTopStaff = async () => {
      try {
        const response = await axiosClient.get("/v1/user/get-highest-average-staff");
        setTopStaff(response.data.data);
      } catch (error) {
        console.error("Error fetching top staff:", error);
      }
    };

    fetchServices();
    fetchTopStaff();
  }, []);

  const handleServiceClick = (id) => {
    navigate(`/services/${id}`);
  };
  const handleAllServicesClick = () => {
    navigate("/services/all");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center h-[500px] transition-all duration-300"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="container mx-auto h-full flex flex-col justify-center items-center text-white relative z-10">
            <h1 className="text-5xl font-extrabold mb-6 text-center">
              Professional Residential and Commercial Cleaning Services
            </h1>
            <button
              onClick={handleAllServicesClick}
              className="mt-6 px-10 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg font-extrabold transition-transform duration-300 hover:scale-105 "
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Video Section */}
        <div className="py-12 ">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl mb-8 text-gray-600 font-extrabold">Watch Our Introduction Video</h2>
            <div className="flex justify-center">
              <video width="900" autoPlay muted loop className="rounded-lg shadow-lg">
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section className="container mx-auto py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-600 font-extrabold">Our Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 transform bg-gradient-to-r from-sky-200 to-blue-50 hover:scale-105"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="mb-4">
                  <img
                    src={service.img || image}
                    alt={service.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-bold text-lg text-gray-700">{service.name}</h3>
                <p className="text-gray-500 mt-2">{service.description}</p>
                <p className="text-gray-800 font-bold mt-2">${service.basePrice}</p>
              </div>
            ))}
          </div>

          {/* View All Services Button */}
          <div className="text-center mt-12">
            <button
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-extrabold rounded-full transition-transform duration-300 hover:scale-105"
              onClick={handleAllServicesClick}
            >
              View All Services
            </button>
          </div>
        </section>

        {/* Top Staff Section */}
        <section className="container mx-auto py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-600 font-extrabold">Top Rated Staff</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center">
            {topStaff.map((staff) => (
              <div
                key={staff.id}
                className="p-6 border rounded-lg shadow-sm hover:shadow-lg bg-gradient-to-r from-sky-200 to-blue-50 transition-shadow duration-300 transform hover:scale-105"
              >
                <div className="mb-4">
                  <img
                    src={staff.img || image}
                    alt={staff.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-bold text-lg text-gray-700">{staff.name}</h3>
                <p className="text-gray-800 font-bold mt-2">Rating: {staff.averageRating} ⭐</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">What Do They Say?</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 border rounded-lg bg-gradient-to-r from-sky-200 to-blue-50 transition-all duration-300 hover:shadow-lg">
                <p className="text-gray-600">"Great service and friendly staff!"</p>
                <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
                <p className="mt-2">- Customer Name</p>
              </div>
              <div className="p-6 border rounded-lg bg-gradient-to-r from-sky-200 to-blue-50 transition-all duration-300 hover:shadow-lg">
                <p className="text-gray-600">"Highly recommend for anyone needing a clean home."</p>
                <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
                <p className="mt-2">- Customer Name</p>
              </div>
              <div className="p-6 border rounded-lg bg-gradient-to-r from-sky-200 to-blue-50 transition-all duration-300 hover:shadow-lg">
                <p className="text-gray-600">"Affordable and efficient!"</p>
                <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
                <p className="mt-2">- Customer Name</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 ">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            <div className="flex-1">
              <h2 className="text-3xl mb-8 text-gray-600 font-extrabold">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-sky-200 hover:bg-gray-200 text-gray-700">
                  <h3 className="font-bold flex justify-between">
                    What do you not clean?
                    <span className="text-[#CF881D]">▼</span>
                  </h3>
                </div>
                <div className="p-4 rounded-md bg-sky-200 hover:bg-gray-200 text-gray-700">
                  <h3 className="font-bold flex justify-between">
                    What is your refund policy?
                    <span className="text-[#CF881D]">▼</span>
                  </h3>
                </div>
                <div className="p-4 rounded-md bg-sky-200 hover:bg-gray-200 text-gray-700">
                  <h3 className="font-bold flex justify-between">
                    Do you guarantee your service?
                    <span className="text-[#CF881D]">▼</span>
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex-1 p-8">
              <img
                src={homepage2}
                alt="FAQs"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>
    </motion.div>
  );
};

export default HomePage;
