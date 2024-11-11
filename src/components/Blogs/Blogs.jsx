import React, { useEffect, useState } from "react";
import axiosClient from "../../services/config/axios";
import { motion } from "framer-motion";
import "./Blogs.css"; // Đường dẫn tới file CSS với lớp animate-gradient

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState(""); // Thêm state cho keyword

  const fetchBlogs = async (page, searchKeyword = "") => {
    try {
      const response = await axiosClient.get(
        `/v1/blogs?pageIndex=${page}&searchTerm=${searchKeyword}`
      );
      
      const blogs = response.data.data.content;
      
      // Kiểm tra xem blogs có phải là mảng không
      if (Array.isArray(blogs)) {
        setBlogs(blogs.reverse()); // Đảo ngược nếu blogs là mảng
      } else {
        console.warn("blogs is not an array");
      }
      
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs(pageIndex, keyword);
  }, [pageIndex, keyword]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPageIndex(newPage);
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center animate-gradient">
        Cleaning Hub Blogs
      </h2>

      {/* Thanh tìm kiếm */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search blogs..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border rounded-l-md px-4 py-2 w-80"
        />
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-6xl space-y-6 bg-slate-100 border rounded-lg p-6">
          {blogs && blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <div key={index} className="shadow p-6 bg-white rounded-lg">
                <h3 className="text-2xl font-semibold mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-700 font-medium mb-4">
                  {blog.content}
                </p>
                {blog.img && (
                  <img
                    src={blog.img}
                    alt="Blog Image"
                    className="w-full h-auto rounded-lg"
                  />
                )}
              </div>
            ))
          ) : (
            <div>Empty</div>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          className="bg-gradient-to-r from-blue-300 to-gray-200 hover:from-gray-300 hover:to-gray-200 text-gray-600 font-bold px-6 py-2 rounded-md cursor-pointer"
          onClick={() => handlePageChange(pageIndex - 1)}
          disabled={pageIndex === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {pageIndex} of {totalPages}
        </span>
        <button
          className="bg-gradient-to-r from-blue-300 to-gray-200 hover:from-gray-300 hover:to-gray-200 text-gray-600 font-bold px-6 py-2 rounded-md cursor-pointer"
          onClick={() => handlePageChange(pageIndex + 1)}
          disabled={pageIndex === totalPages}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Blogs;
