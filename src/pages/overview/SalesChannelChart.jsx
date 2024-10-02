import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Sửa lại import
import axiosClient from "../../services/config/axios";
import { format } from "date-fns";

const BookingList = () => {
	const [bookings, setBookings] = useState([]);
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [bookingStatus, setBookingStatus] = useState("PENDING");
	const [staffId, setStaffId] = useState(null);
  
	useEffect(() => {
	  const token = localStorage.getItem("token");
	  if (token) {
		try {
		  const decodedToken = jwtDecode(token);
		  setStaffId(decodedToken.id);
		} catch (error) {
		  console.error("Invalid token", error);
		}
	  }
	}, []);
  
	useEffect(() => {
	  const fetchBookings = async () => {
		if (!staffId) return;
  
		try {
		  const response = await axiosClient.get("/v1/bookings/get-by-current-staff", {
			params: {
			  staffId,
			  page,
			  size,
			  bookingStatus,
			},
		  });
  
		  setBookings(response.data.data.content);
		  setTotalPages(response.data.data.totalPages);
		} catch (error) {
		  console.error("Error fetching bookings:", error);
		}
	  };
  
	  fetchBookings();
	}, [staffId, page, size, bookingStatus]);
  
	const handlePreviousPage = () => {
	  if (page > 0) {
		setPage(page - 1);
	  }
	};
  
	const handleNextPage = () => {
	  if (page < totalPages - 1) {
		setPage(page + 1);
	  }
	};
  
	const handleStatusChange = (event) => {
	  setBookingStatus(event.target.value);
	  setPage(0);
	};
  
	return (
	  <motion.div
		className="bg-gradient-to-r from-purple-600 to-blue-500 shadow-xl rounded-xl p-6 lg:col-span-2 border border-gray-700"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.4 }}
	  >
		<div className="flex justify-between items-center mb-4">
		  <h2 className="text-2xl font-semibold text-white">Booking List</h2>
		  <select
			value={bookingStatus}
			onChange={handleStatusChange}
			className="bg-white text-gray-700 px-4 py-2 rounded-md shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
		  >
			<option value="PENDING">Pending</option>
			<option value="IN_PROGRESS">In Progress</option>
			<option value="COMPLETED">Completed</option>
			<option value="CANCELLED">Cancelled</option>
		  </select>
		</div>
  
		{bookings.length > 0 ? (
		  <div className="overflow-x-auto">
			<table className="min-w-full bg-white rounded-lg shadow-md">
			  <thead>
				<tr>
				  <th className="py-3 px-6 text-center text-gray-600 font-semibold uppercase">ID</th>
				  <th className="py-3 px-6 text-center text-gray-600 font-semibold uppercase">Customer</th>
				  <th className="py-3 px-6 text-center text-gray-600 font-semibold uppercase">Service</th>
				  <th className="py-3 px-6 text-center text-gray-600 font-semibold uppercase">Status</th>
				  <th className="py-3 px-6 text-center text-gray-600 font-semibold uppercase">Time</th>
				</tr>
			  </thead>
			  <tbody>
				{bookings.map((booking) => (
				  <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100 transition">
					<td className="py-4 px-6 text-sm text-center text-gray-700">{booking.id}</td>
					<td className="py-4 px-6 text-sm text-center text-gray-700">{booking.user.email}</td>
					<td className="py-4 px-6 text-sm text-center text-gray-700">{booking.service.name}</td>
					<td className="py-4 px-6 text-center">
					  <span
						className={`px-3 py-1 rounded-full text-xs font-semibold ${
						  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
						  booking.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
						  booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
						  booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
						  'bg-gray-100 text-gray-800'
						}`}
					  >
						{booking.status}
					  </span>
					</td>
					<td className="py-4 px-6 text-sm text-center text-gray-700">
					  {`${format(new Date(booking.startDate), 'dd/MM/yyyy HH:mm')} - ${format(new Date(booking.endDate), 'dd/MM/yyyy HH:mm')}`}
					</td>
				  </tr>
				))}
			  </tbody>
			</table>
  
			<div className="flex justify-between items-center mt-6">
			  <button
				onClick={handlePreviousPage}
				disabled={page === 0}
				className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md shadow-md hover:opacity-80 transition duration-300 disabled:opacity-50"
			  >
				Previous
			  </button>
			  <span className="text-white">
				Page {page + 1} of {totalPages}
			  </span>
			  <button
				onClick={handleNextPage}
				disabled={page >= totalPages - 1}
				className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md shadow-md hover:opacity-80 transition duration-300 disabled:opacity-50"
			  >
				Next
			  </button>
			</div>
		  </div>
		) : (
		  <p className="text-white mt-6 text-center">
			No bookings found for this staff.
		  </p>
		)}
	  </motion.div>
	);
  };
  
  export default BookingList;