import React, { useEffect, useState } from "react";
import axiosClient from "../../services/config/axios";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Hàm gọi API để lấy danh sách blog
    const fetchBlogs = async (page) => {
        try {
            const response = await axiosClient.get(`/v1/blogs?pageIndex=${page}`);
            setBlogs(response.data.data.content); // Giả sử `content` là nơi chứa danh sách blog
            setTotalPages(response.data.data.totalPages); // Giả sử `totalPages` là tổng số trang
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    // Gọi API khi pageIndex thay đổi
    useEffect(() => {
        fetchBlogs(pageIndex);
    }, [pageIndex]);

    // Hàm chuyển đến trang trước hoặc trang tiếp theo
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPageIndex(newPage);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Blogs</h2>

            <div className="space-y-4">
                {blogs.map((blog, index) => (
                    <div key={index} className="p-4 border rounded-lg shadow">
                        <h3 className="text-xl font-semibold">{blog.title}</h3>
                        <p className="text-gray-600">{blog.content}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-6 space-x-2">
                <button
                    className="px-4 py-2 bg-gray-300 text-black rounded"
                    onClick={() => handlePageChange(pageIndex - 1)}
                    disabled={pageIndex === 1}
                >
                    Previous
                </button>
                <span className="px-4 py-2">{pageIndex} / {totalPages}</span>
                <button
                    className="px-4 py-2 bg-gray-300 text-black rounded"
                    onClick={() => handlePageChange(pageIndex + 1)}
                    disabled={pageIndex === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Blogs;
