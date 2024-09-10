import React from "react";

const HomePage = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to Our Website</h1>
      <p className="text-lg text-center">
        This is a simple homepage built with React, Tailwind CSS, and Ant Design.
      </p>
      <div className="mt-8 flex justify-center">
        <button className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;
