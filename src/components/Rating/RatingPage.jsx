import { message } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

// Component chính
const RatingPage = () => {
  const { state } = useLocation();
  const bookingId = state?.bookingId;
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(bookingId && rating > 0){
      const ratingRequest = {
        bookingId,
        stars: rating,
        comments
      };

      try{
        const jwtToken = localStorage.getItem('token');
        await axios.post(`v1/ratings`, ratingRequest, {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        });
        setSubmitted(true);
      }catch(error){
        message.error(error);
      }
    }else{
      message.info("Please select a rating");
    }
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
            <div className="mb-6"> 
              <TextArea value={comments} onChange={(e) => setComments(e.target.value)} rows={4} placeholder="Vui lòng nêu cảm nhận của bạn về nhân viên" />
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
