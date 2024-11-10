import { BarChart2, Menu, Coffee, LogOut, AppWindowIcon, BookCheck, User} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {notification } from "antd";
import axiosClient from "../../services/config/axios";

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const handleLogout = async () => {
		const token = localStorage.getItem("token");
		try {
		  await axiosClient.post(
			"/v1/auth/logout",
			{},
			{
			  headers: {
				Authorization: `Bearer ${token}`,
			  },
			}
		  );
		  notification.success({
			message: "Đăng xuất thành công",
			description: "Bạn đã đăng xuất thành công.",
			duration: 2,
		  });
		  localStorage.removeItem("token");
		  localStorage.removeItem("refresh_token");
		  
		  window.location.href = "/login";
		} catch (error) {
		  notification.error({
			message: "Lỗi đăng xuất",
			description: error?.message || "Đã xảy ra sự cố. Vui lòng thử lại sau!",
		  });
		}
	  };

	const handleBlog = async () => {

	}


	  const SIDEBAR_ITEMS = [
		{
			id: 1,
			name: "Overview",
			icon: BarChart2,
			color: "#6366f1",
			href: "/",
		},
		{
			id: 2,
			name: "Category",
			icon: AppWindowIcon,
			color: "#6366f1",
			href: "/categories",
		},
		{
			id: 3,
			name: "Service",
			icon: BookCheck,
			color: "#6366f1",
			href: "/services",
		},
		{
			id: 4,
			name: "Account",
			icon: User,
			color: "#6366f1",
			href: "/accounts",
		},
		{
			id: 5,
			name: "Blog",
			icon: Coffee,
			color: "#6366f1",
			href: "/blogs"
		},
		{
			id: 6,
			name: "Log Out",
			icon: LogOut,
			color: "#6366f1",
			action: handleLogout
		}
		
		];
	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
				>
					<Menu size={24} />
				</motion.button>

				<nav className='mt-8 flex-grow'>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.id} to={item.href}>
							<motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'
							key={item.id}
							onClick={item.action || null}
							>
								<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>
			</div>
		</motion.div>
	);
};
export default Sidebar;
