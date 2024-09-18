import image from "../../assets/image/image.png";

const HomePage = () => {
  return (
    <div className="bg-yellow-50">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[500px]"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto h-full flex flex-col justify-center items-center text-white relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Professional Residential and Commercial Cleaning Services
          </h1>
          <button className="mt-6 px-6 py-3 rounded-md bg-[#CF881D] hover:bg-orange-800 transition-colors duration-300">
            Book Now
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Our Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 border rounded-lg">
            <div className="mb-4 text-yellow-500">
              <i className="fas fa-carpet"></i>
            </div>
            <h3 className="font-bold text-lg">Carpet Cleaning</h3>
            <p className="text-gray-600 mt-2">
              Description of carpet cleaning service.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <div className="mb-4 text-yellow-500">
              <i className="fas fa-bed"></i>
            </div>
            <h3 className="font-bold text-lg">Bedroom Cleaning</h3>
            <p className="text-gray-600 mt-2">
              Description of bedroom cleaning service.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <div className="mb-4 text-yellow-500">
              <i className="fas fa-couch"></i>
            </div>
            <h3 className="font-bold text-lg">Sofa Cleaning</h3>
            <p className="text-gray-600 mt-2">
              Description of sofa cleaning service.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <div className="mb-4 text-yellow-500">
              <i className="fas fa-toilet"></i>
            </div>
            <h3 className="font-bold text-lg">Toilet Cleaning</h3>
            <p className="text-gray-600 mt-2">
              Description of toilet cleaning service.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Client Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg bg-gray-800">
              <p className="text-gray-400">
                "Great service and friendly staff!"
              </p>
              <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
              <p className="mt-2">- Customer Name</p>
            </div>
            <div className="p-6 border rounded-lg bg-gray-800">
              <p className="text-gray-400">
                "Highly recommend for anyone needing a clean home."
              </p>
              <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
              <p className="mt-2">- Customer Name</p>
            </div>
            <div className="p-6 border rounded-lg bg-gray-800">
              <p className="text-gray-400">"Affordable and efficient!"</p>
              <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
              <p className="mt-2">- Customer Name</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="border p-4 rounded-md hover:bg-gray-100">
              <h3 className="font-bold">What do you not clean?</h3>
            </div>
            <div className="border p-4 rounded-md hover:bg-gray-100">
              <h3 className="font-bold">
                Do I need to be home for every cleaning service?
              </h3>
            </div>
            <div className="border p-4 rounded-md hover:bg-gray-100">
              <h3 className="font-bold">How will our relationship work?</h3>
            </div>
            <div className="border p-4 rounded-md hover:bg-gray-100">
              <h3 className="font-bold">What time does your team arrive?</h3>
            </div>
          </div>
          <button className="mt-6 bg-[#CF881D] hover:bg-orange-800 text-white px-6 py-3 rounded-md">
            View All FAQ
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
