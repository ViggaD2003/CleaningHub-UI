import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeInput from 'react-code-input';
import axiosClient from '../../services/config/axios';

const ActivateAccount = () => {
    const [token, setToken] = useState('');
    const navigate = useNavigate();
  
    const handleCodeChange = (value) => {
        setToken(value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        // Gửi token như là query parameter
        const response = await axiosClient.get('/v1/auth/activate-account', {
            params: { token } // Token được gửi dưới dạng query parameter
        });

        console.log(response);
  
        if (response.status === 200) { // Kiểm tra mã trạng thái HTTP
          // Kích hoạt thành công, chuyển hướng người dùng tới trang đăng nhập hoặc thông báo thành công
          navigate('/login');
        } else {
          // Xử lý lỗi, ví dụ như hiển thị thông báo mã kích hoạt không hợp lệ
          alert('Mã kích hoạt không hợp lệ. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Error activating account:', error);
        alert('Đã xảy ra lỗi khi kích hoạt tài khoản.');
      }
    };
  
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Activate Your Account</h1>
          <p className="mb-4">Enter the activation code sent to your email:</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <CodeInput
                type="text"
                fields={6} // Số ký tự của mã kích hoạt
                onChange={handleCodeChange}
                inputStyle={{
                  fontFamily: 'monospace',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  margin: '4px',
                  paddingLeft: '8px',
                  width: '50px',
                  height: '50px',
                  fontSize: '24px',
                  textAlign: 'center',
                }}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Activate Account
            </button>
          </form>
        </div>
      </div>
    );
};

export default ActivateAccount;
