import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import './CalendarComponent.css';
import axiosClient from '../../services/config/axios';
import { notification, Modal } from "antd";

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null); // State để lưu thông tin booking đã chọn

  const fetchBookingByStaffPending = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/v1/bookings/get-by-current-staff-pending");
      const bookings = response.data.data;

      console.log(response)
      const formattedEvents = bookings.map(booking => ({
        id: booking.id,
        title: `${booking.service.name} - ${booking.user.username}`,
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
        allDay: false,
        details: booking, // Lưu thông tin chi tiết booking
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải thông tin người dùng.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingByStaffPending();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedBooking(event.details); // Lưu thông tin booking đã chọn
  };

  const handleCloseModal = () => {
    setSelectedBooking(null); // Đóng modal
  };

  return (
    <motion.div
      className="bg-gray-900 text-black p-10 flex-1 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={events}
        style={{ height: "50vh" }}
        onSelectEvent={handleSelectEvent} // Thêm sự kiện khi chọn booking
        components={{
          toolbar: (props) => (
            <div className="flex justify-between items-center mb-4">
              <div>
                <button
                  onClick={() => props.onNavigate('TODAY')}
                  className="bg-indigo-700 text-white px-3 py-2 rounded-md hover:bg-violet-800"
                >
                  Today
                </button>
                <button
                  onClick={() => props.onNavigate('PREV')}
                  className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-700 mx-2"
                >
                  Back
                </button>
                <button
                  onClick={() => props.onNavigate('NEXT')}
                  className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
              <div className="text-white text-lg font-bold">
                {moment(props.date).format('MMMM YYYY')}
              </div>
              <div>
                <button
                  onClick={() => props.onView('month')}
                  className={`${
                    props.view === 'month' ? 'bg-indigo-700' : 'bg-gray-500'
                  } text-white px-3 py-2 rounded-md hover:bg-violet-800 mx-2`}
                >
                  Month
                </button>
                <button
                  onClick={() => props.onView('week')}
                  className={`${
                    props.view === 'week' ? 'bg-indigo-700' : 'bg-gray-500'
                  } text-white px-3 py-2 rounded-md hover:bg-violet-800 mx-2`}
                >
                  Week
                </button>
                <button
                  onClick={() => props.onView('day')}
                  className={`${
                    props.view === 'day' ? 'bg-indigo-700' : 'bg-gray-500'
                  } text-white px-3 py-2 rounded-md hover:bg-violet-800 mx-2`}
                >
                  Day
                </button>
              </div>
            </div>
          ),
        }}
      />
      
      {/* Modal hiển thị thông tin booking */}
      <Modal
        title="Thông tin booking"
        visible={!!selectedBooking}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedBooking && (
          <div>
            <p><strong>Dịch vụ:</strong> {selectedBooking.service.name}</p>
            <p><strong>Người dùng:</strong> {selectedBooking.user.username}</p>
            <p><strong>Thời gian bắt đầu:</strong> {moment(selectedBooking.startDate).format('YYYY-MM-DD HH:mm')}</p>
            <p><strong>Thời gian kết thúc:</strong> {moment(selectedBooking.endDate).format('YYYY-MM-DD HH:mm')}</p>
            {/* Bạn có thể thêm các thông tin khác của booking nếu cần */}
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default CalendarComponent;
