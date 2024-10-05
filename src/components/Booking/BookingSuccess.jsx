const BookingSuccess = () => {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Booking Successful!</h1>
        <p className="text-gray-700 mb-6">
          Thank you for your booking. We will contact you shortly to confirm the details.
        </p>
        <a
          href="/"
          className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
        >
          Go to Home
        </a>
      </div>
    );
  };
  
  export default BookingSuccess;
  