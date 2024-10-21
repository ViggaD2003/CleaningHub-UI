// src/components/ErrorPage.jsx

import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-red-600 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-lg">Trang không tìm thấy!</p>
        <p className="mt-2">Xin hãy kiểm tra lại đường dẫn hoặc trở về trang chính.</p>
        <a href="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 rounded">
          Về trang chủ
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
