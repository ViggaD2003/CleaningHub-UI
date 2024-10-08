import { useState, useEffect } from "react";
import axiosClient from "../../services/config/axios";
import image from "../../assets/image/image.png";
import { useNavigate } from "react-router-dom";
import homepage1 from "../../assets/image/homepage1.jpg";
import homepage2 from "../../assets/image/homepage2.jpg";
import video from "../../assets/image/video.mp4";

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
        const response = await axiosClient.get("/v1/user/get-highest-average-staff"); // Lấy dữ liệu từ API top 5 staff
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
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[500px] transition-all duration-300"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto h-full flex flex-col justify-center items-center text-white relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Professional Residential and Commercial Cleaning Services
          </h1>
          <button className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-md transition-colors duration-300 font-semibold hover:from-yellow-400 hover:to-pink-500">
            Book Now
          </button>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Watch Our Introduction Video</h2>
          <div className="flex justify-center">
            <video width="900" autoPlay muted loop className="rounded-lg shadow-lg">
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Our Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-6 border rounded-lg hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
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

        {/* View All Services Button */}
        <div className="text-center mt-12">
          <button
            className="px-8 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full transition-colors duration-300 font-semibold hover:from-yellow-400 hover:to-pink-500"
            onClick={handleAllServicesClick}
          >
            View All Services
          </button>
        </div>
      </section>

      {/* Top Staff Section */}
      <section className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Top Rated Staff</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center">
          {topStaff.map((staff) => (
            <div
              key={staff.id}
              className="p-6 border rounded-lg hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="mb-4">
                <img
                  src={staff.img || image}
                  alt={staff.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <h3 className="font-bold text-lg">{staff.name}</h3>
              <p className="text-gray-800 font-bold mt-2">Rating: {staff.averageRating} ⭐</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-12 text-black">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Client Feedback</h2>
          <h1 className="text-3xl font-bold mb-8">
            What Do They Say About Cleaning Services?
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg bg-gray-100 transition-all duration-300 hover:shadow-lg">
              <p className="text-gray-600">"Great service and friendly staff!"</p>
              <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
              <p className="mt-2">- Customer Name</p>
            </div>
            <div className="p-6 border rounded-lg bg-gray-100 transition-all duration-300 hover:shadow-lg">
              <p className="text-gray-600">"Highly recommend for anyone needing a clean home."</p>
              <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
              <p className="mt-2">- Customer Name</p>
            </div>
            <div className="p-6 border rounded-lg bg-gray-100 transition-all duration-300 hover:shadow-lg">
              <p className="text-gray-600">"Affordable and efficient!"</p>
              <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
              <p className="mt-2">- Customer Name</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white text-black">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-8 text-[#CF881D]">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border p-4 rounded-md bg-gray-100 text-black hover:bg-gray-200">
                <h3 className="font-bold flex justify-between">
                  What do you not clean?
                  <span className="text-[#CF881D]">▼</span>
                </h3>
              </div>
              <div className="border p-4 rounded-md bg-gray-100 text-black hover:bg-gray-200">
                <h3 className="font-bold flex justify-between">
                  Do I need to be home for every cleaning service?
                  <span className="text-[#CF881D]">▼</span>
                </h3>
              </div>
              <div className="border p-4 rounded-md bg-gray-100 text-black hover:bg-gray-200">
                <h3 className="font-bold flex justify-between">
                  How will our relationship work?
                  <span className="text-[#CF881D]">▼</span>
                </h3>
              </div>
              <div className="border p-4 rounded-md bg-gray-100 text-black hover:bg-gray-200">
                <h3 className="font-bold flex justify-between">
                  Can I skip or reschedule bookings?
                  <span className="text-[#CF881D]">▼</span>
                </h3>
              </div>
            </div>
          </div>
          <div className="flex-1 md:flex justify-center">
            <img
              src={homepage1}
              alt="FAQ Image 1"
              className="w-1/2 h-auto rounded-md mr-4 ml-20"
            />

            <img
              src={homepage2}
              alt="FAQ Image 2"
              className="w-1/2 h-auto rounded-md"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
