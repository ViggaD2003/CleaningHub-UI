// src/components/CalendarComponent.jsx
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion'; // Import motion
import './CalendarComponent.css';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  return (
    <motion.div
      className="bg-gray-900 text-black p-10 flex-1 relative"
      initial={{ opacity: 0 }} // Hiệu ứng ban đầu
      animate={{ opacity: 1 }} // Hiệu ứng khi xuất hiện
      transition={{ duration: 0.5 }} // Thời gian chuyển đổi
    >
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "50vh" }} // Chiều cao của lịch
        components={{
          toolbar: (props) => (
            <div className="flex justify-between items-center mb-4">
              {/* Các nút điều hướng */}
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
              {/* Hiển thị ngày tháng hiện tại */}
              <div className="text-white text-lg font-bold">
                {moment(props.date).format('MMMM YYYY')}
              </div>
              {/* Các chế độ hiển thị */}
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
    </motion.div>
  );
};

export default CalendarComponent;
