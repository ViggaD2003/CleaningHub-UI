import { useState, useEffect } from "react";
import axiosClient from "../../services/config/axios";
import { Zap,BarChart2, Star } from "lucide-react"; 
import { motion } from "framer-motion";

import Header from "../Admin/Header";
import StatCard from "../Admin/StatCard";
import SalesOverviewChart from "../overview/SalesOverviewChart";
import CategoryDistributionChart from "../overview/CategoryDistributionChart";
import BookingList from "../overview/SalesChannelChart";

const OverviewPage = () => {
  const [setTotalRevenue] = useState(0);
  const [totalRevenue ,totalBookings, setTotalBookings] = useState(0);
  const [averageRating, setAverageRating] = useState(null); // Initially null to handle no data scenario
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [revenueResponse, bookingsResponse, ratingResponse] = await Promise.all([
          axiosClient.get("/v1/admin/total-revenue"),
          axiosClient.get("/v1/admin/total-bookings"),
          axiosClient.get("/v1/admin/average-rating"),
        ]);

        setTotalRevenue(revenueResponse.data.totalRevenue);
        setTotalBookings(bookingsResponse.data.totalBookings);
        setAverageRating(ratingResponse.data.averageRating);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); 
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="text-yellow-500" />); 
    }
    return stars;
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
		<StatCard
            name="Total Revenue"
            icon={Zap}
            value={`$${totalRevenue.toLocaleString()}`} // Format the value
            color="#6366F1"
        />
          <StatCard
            name="Total Bookings"
            icon={BarChart2}
            value={totalBookings}
            color="#10B981"
          />
          <StatCard
            name="Average Rating"
            icon={() => renderStars(averageRating || 0)} // Ensure stars are displayed even if rating is 0 or null
            value={averageRating !== null ? `${averageRating.toFixed(1)} / 5` : 'N/A'} // Display N/A if rating is not available
            color="#F59E0B"
          />
        </motion.div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
          <BookingList />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
