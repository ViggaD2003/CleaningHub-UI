import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axiosClient from "../../services/config/axios";
import { format } from "date-fns";
const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
  
    useEffect(() => {
      const fetchBookings = async () => {
        try {
          const response = await axiosClient.get("/v1/bookings/history", {
            params: {
              searchTerm,
              pageIndex,
              pageSize,
            },
          });
  
          setPayments(response.data.content);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      };
  
      fetchBookings();
    }, [pageIndex, pageSize, searchTerm]);
  
    const handlePreviousPage = () => {
      if (pageIndex > 0) {
        setPageIndex(pageIndex - 1);
      }
    };
  
    const handleNextPage = () => {
      if (pageIndex < totalPages - 1) {
        setPageIndex(pageIndex + 1);
      }
    };
  
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
      setPageIndex(0);
    };
  
    return (
      <motion.div
        className="w-full h-screen  shadow-xl p-8 border border-gray-700 flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-amber-500">Payment History</h2>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-white text-gray-700 px-4 py-2 rounded-md shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 w-1/3"
          />
        </div>
  
        {payments.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4 flex-1">
            <table className="min-w-full text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-6 text-sm font-semibold uppercase">ID</th>
                  <th className="py-3 px-6 text-sm font-semibold uppercase">Address</th>
                  <th className="py-3 px-6 text-sm font-semibold uppercase">Service Name</th>
                  <th className="py-3 px-6 text-sm font-semibold uppercase">Staff Name</th>
                  <th className="py-3 px-6 text-sm font-semibold uppercase">Status</th>
                  <th className="py-3 px-6 text-sm font-semibold uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-100 transition">
                    <td className="py-4 px-6 text-sm text-gray-700">{payment.id}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{payment.address}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{payment.serviceName}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{payment.staffName}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : payment.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : payment.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {`${format(new Date(payment.bookingDate), 'dd/MM/yyyy HH:mm')}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
  
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePreviousPage}
                disabled={pageIndex === 0}
                className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-md shadow-lg duration-300 disabled:opacity-50 hover:from-yellow-400 hover:to-pink-500"
              >
                Previous
              </button>
              <span className="text-gray-700 font-semibold">
                Page {pageIndex + 1} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={pageIndex >= totalPages - 1}
                className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-md shadow-lg duration-300 disabled:opacity-50 hover:from-yellow-400 hover:to-pink-500"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="text-orange-400 mt-6 text-center text-lg font-medium">
            No bookings found for this staff.
          </p>
        )}
      </motion.div>
    );
  };
  
  export default PaymentHistory;