import React, { useEffect, useState } from "react";
import axiosClient from "../../services/config/axios";
import { motion } from "framer-motion";
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Form, Input, Modal, Upload, Spin } from "antd";
import { storage } from "../../services/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const BlogsAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState(""); // State cho keyword tìm kiếm
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [img, setImg] = useState(null); // Để hiển thị ảnh tạm thời
  const [photoFile, setPhotoFile] = useState(null); // Để lưu file gốc cho upload
    const [photoLoading, setPhotoLoading] = useState(false); // State kiểm tra khi đang tải ảnh
  const [form] = Form.useForm();
  const [blogId, setBlogId] = useState(null);
  const openModal = (blog = null) => {
    setIsModalVisible(true);
    setSelectedBlog(blog);
    if(blog) setBlogId(blog.id) ;
    setImg(blog?.img || null); // Set lại ảnh khi mở modal
    form.setFieldsValue({
      title: blog?.title || "",
      content: blog?.content || "",
    });
  };

  const handleFileChange = (blogId, info) => {
    const file = info.file;
    if (file) {
      editPhoto(blogId, file);
    }
  };

  const editPhoto = async (blogId, file) => {
    setPhotoLoading(true);
    try {
      const imgRef = ref(storage, `file/${uuidv4()}`);
      await uploadBytes(imgRef, file);
      const downloadURL = await getDownloadURL(imgRef);
      await axiosClient.patch(`/v1/blogs/update-img-blog?blogId=${blogId}`, downloadURL);
      setImg(downloadURL);
      message.success({
        content: "Blog photo updated successfully !",
      });
    } catch (error) {
        message.error({
        content: error,
      });
      
    } finally {
      setPhotoLoading(false);
    }
  };

  const fetchBlogs = async (page, searchKeyword = "") => {
    try {
      const response = await axiosClient.get(
        `/v1/blogs?pageIndex=${page}&searchTerm=${searchKeyword}`
      );
      setBlogs(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleFileChangeForCreateBlog = async (info) => {
    const file = info.file;
  if (file) {
    const previewUrl = URL.createObjectURL(file); // Tạo URL tạm cho ảnh
    setImg(previewUrl); // Lưu URL tạm vào state img để hiển thị trước
    setPhotoFile(file); 
  }
  }

  const handleUpdateBlog = async (values) => {
    try {
      const blogData = { ...values}; // Thêm ảnh vào dữ liệu gửi đi
      if (selectedBlog) {
        await axiosClient.put(`/v1/blogs/update-blog?blogId=${selectedBlog.id}`, blogData);
        message.success({
          content: "Blog updated successfully",
        });
      } 
      fetchBlogs(pageIndex, keyword);
      handleModalClose();
    } catch (error) {
        message.error({
        content: error,
        description: "Failed to update or create blog.",
      });
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await axiosClient.delete(`/v1/blogs/delete-blog?blogId=${id}`);
      message.success({
        content: "Blog deleted successfully",
        duration: 0.5
      });
      fetchBlogs(pageIndex, keyword);
    } catch (error) {
        message.error({
        content: error,
        description: "Failed to delete blog.",
      });
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

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedBlog(null);
    setImg(null);
    form.resetFields();
  };

  const handleCreateBlog = async (values) => {
  setPhotoLoading(true);
  try {
    let downloadURL = "";

    // Nếu có ảnh đã chọn thì upload lên Firebase
    if (img) {
      const imgRef = ref(storage, `file/${uuidv4()}`);
      await uploadBytes(imgRef, photoFile);
      downloadURL = await getDownloadURL(imgRef);
    }
    const blogData = {
      title: values.title,
      content: values.content,
      img: downloadURL,
    };

    // Send request to create blog
    await axiosClient.post("/v1/blogs", blogData);
    message.success({
      content: "Blog created successfully!",
    });

    // Refresh the list and close the modal
    fetchBlogs(pageIndex, keyword);
    handleModalClose();
  } catch (error) {
    message.error({
      content: "Failed to create blog.",
    });
    console.error(error);
  } finally {
    setPhotoLoading(false);
  }
};

  return (
    <motion.div
      className="container mx-auto p-4 text-black"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search blogs..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border rounded-l-md px-4 py-2 w-80"
        />
      </div>
      <button
        className="mb-8 bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-md flex items-center"
        onClick={() => openModal()}
      >
        <PlusOutlined className="mr-2" /> Create New Blog
      </button>
      
      <div className="flex justify-center">
        <div className="w-full max-w-full bg-slate-100 border rounded-lg p-6">
          {blogs && blogs.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Content</th>
                  <th className="px-6 py-3 text-left">Image</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-6 py-4">{blog.title}</td>
                    <td className="px-6 py-4">{blog.content}</td>
                    <td className="px-6 py-4">
                      {blog.img && (
                        <img
                          src={blog.img}
                          alt="Blog Image"
                          className="w-20 h-auto rounded-lg"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <EditOutlined
                        style={{
                          fontSize: "18px",
                          color: "#1890ff",
                          cursor: "pointer",
                          marginRight: "12px",
                        }}
                        onClick={() => openModal(blog)}
                      />
                      <DeleteOutlined
                        style={{
                          fontSize: "18px",
                          color: "#ff4d4f",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeleteBlog(blog.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>Empty</div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          className="bg-gradient-to-r from-blue-300 to-gray-200 hover:from-gray-300 hover:to-gray-200 text-gray-600 font-bold px-6 py-2 rounded-md cursor-pointer"
          onClick={() => handlePageChange(pageIndex - 1)}
        >
          Previous
        </button>
        <span className="text-gray-700 font-semibold">
          Page {pageIndex} of {totalPages}
        </span>
        <button
          className="bg-gradient-to-r from-blue-300 to-gray-200 hover:from-gray-300 hover:to-gray-200 text-gray-600 font-bold px-6 py-2 rounded-md cursor-pointer"
          onClick={() => handlePageChange(pageIndex + 1)}
        >
          Next
        </button>
      </div>
      
      <Modal
        title={selectedBlog ? "Update Blog" : "Create Blog"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        onOk={() => {
          form
            .validateFields()
            .then((values) =>  selectedBlog ? handleUpdateBlog(values) : handleCreateBlog(values) )
            .catch((info) => console.error("Validate Failed:", info));
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input/>
          </Form.Item>
          <Form.Item label="Content" name="content" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Image" name="img">
            <div className="profile-photo-wrapper flex flex-col items-center mb-4 disabled:read-only">
              {photoLoading ? (
                <Spin />
              ) : (
                <img
                  src={img}
                  alt="Blog Image"
                  className="profile-photo w-24 h-24 object-cover rounded-lg border-2 border-gray-300 mb-2"
                />
              ) }
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={(info, ) => selectedBlog ? handleFileChange(blogId, info) : handleFileChangeForCreateBlog(info) }
              >
                <button className="bg-blue-500 text-white py-2 px-4 rounded">
                  <UploadOutlined /> Upload Image
                </button>
              </Upload>
            </div>
          </Form.Item>
        </Form>
      </Modal>

   
    </motion.div>
  );
};

export default BlogsAdmin;
