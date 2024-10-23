import React, { useState } from "react";

// Component chính
const RatingPage = () => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    console.log(`User rated ${rating} stars`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">
          Đánh giá chất lượng phục vụ
        </h1>
        {!submitted ? (
          <>
            <p className="text-lg mb-4 text-center text-gray-700">
              Vui lòng chọn số sao để đánh giá:
            </p>
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  filled={star <= rating}
                  onClick={() => handleRating(star)}
                />
              ))}
            </div>
            <button
              className={`w-full py-3 text-lg font-semibold text-white rounded-lg transition duration-300 ease-in-out ${
                rating > 0
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
              disabled={rating === 0}
            >
              Gửi đánh giá
            </button>
          </>
        ) : (
          <MotivationCard rating={rating} />
        )}
      </div>
    </div>
  );
};

// Component Star
const Star = ({ filled, onClick }) => {
  return (
    <span
      className={`cursor-pointer text-4xl mx-1 transition-colors duration-300 ${
        filled ? "text-yellow-400" : "text-gray-300"
      }`}
      onClick={onClick}
    >
      {filled ? "★" : "☆"}
    </span>
  );
};

// Component MotivationCard
const MotivationCard = ({ rating }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Cảm ơn bạn đã đánh giá!
      </h2>
      <p className="text-lg text-gray-800">
        Bạn đã đánh giá <span className="font-semibold">{rating} sao</span> cho
        nhân viên.
      </p>
      <p className="text-gray-600 mt-4">
        "Chúng tôi luôn nỗ lực cải thiện chất lượng dịch vụ. Mỗi đánh giá của
        bạn đều quý giá!"
      </p>
      <button
        className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-300"
        onClick={() => window.location.reload()}
      >
        Đánh giá lại
      </button>
    </div>
  );
};

export default RatingPage;
