import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, message, notification } from 'antd';
import { UserOutlined, LaptopOutlined, BookOutlined, MessageOutlined, LogoutOutlined, DownOutlined, CalendarOutlined} from '@ant-design/icons';
import 'antd/dist/reset.css'; // Import Ant Design styles
import { Content, Header } from "antd/es/layout/layout";
import { Outlet, Link, useNavigate } from "react-router-dom";
import BookingNotificationComponent from '../../components/Notifications/BookingNotification/BookingNotificationComponent';
import { jwtDecode } from 'jwt-decode'; // Correct import
import axios from 'axios';
import StaffTracker from "../../components/AutoGetLocationOfStaff/StaffLocaltionTracker"

const { Sider } = Layout;

const StaffLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            message.error("Invalid credentials");
            navigate("/");
        } else {
            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.role;

                if (role !== "ROLE_STAFF") {
                    message.error("Unauthorized");
                    navigate("/");
                }
            } catch (error) {
                message.error("Invalid token");
                navigate("/");
            }
        }
    }, [navigate]);

    const onCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                "/v1/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            notification.success({
                message: "Logout Successful",
                description: "You have been logged out successfully.",
                duration: 2,
            });
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
        } catch (error) {
            notification.error({
                message: "Logout Error",
                description: error?.message || "An error occurred. Please try again later!",
            });
        }
    };

    // Define the menu items using the `items` prop with icons
    const menuItems = [
        {
            key: '1',
            label: (
                <Dropdown
                    menu={{
                        items: [
                            { key: 'profile', label: <Link to="/staff/getInformation">Profile</Link>, icon: <UserOutlined /> },
                            {
                                key: 'logout',
                                label: (
                                    <button onClick={handleLogout}>
                                        <LogoutOutlined className="mr-2" /> Logout
                                    </button>
                                ),
                                style: {
                                    backgroundColor: 'red',
                                    color: 'white'
                                }
                            },
                        ],
                    }}
                    trigger={['click']}
                >
                    <a
                        onClick={(e) => e.preventDefault()}
                        className="text-white flex space-x-2"
                    >
                        <UserOutlined /><span>Account</span><DownOutlined />
                    </a>
                </Dropdown>
            ),
            style: {
                backgroundColor: selectedKey === '1' ? 'white' : 'transparent',
                color: selectedKey === '1' ? '#fb923c' : '#fff',
            },
        },
        {
            key: '2',
            icon: <LaptopOutlined />,
            label: <Link to="/dashboard">Dashboard</Link>,
            style: {
                backgroundColor: selectedKey === '2' ? 'white' : 'transparent',
                color: selectedKey === '2' ? '#fb923c' : '#fff',
            },
        },
        {
            key: '3',
            icon: <BookOutlined />,
            label: <Link to="/bookings">Bookings</Link>,
            style: {
                backgroundColor: selectedKey === '3' ? 'white' : 'transparent',
                color: selectedKey === '3' ? '#fb923c' : '#fff',
            },
        },
        {
            key: '4',
            icon: <MessageOutlined />,
            label: <Link to="/feedbacks">Feedbacks</Link>,
            style: {
                backgroundColor: selectedKey === '4' ? 'white' : 'transparent',
                color: selectedKey === '4' ? '#fb923c' : '#fff',
            },
        },
        {
            key: '5',
            icon: <CalendarOutlined/>,
            label: <Link to="/calendar">Calendar</Link>,
            style: {
                backgroundColor: selectedKey === '5' ? 'white' : 'transparent',
                color: selectedKey === '5' ? '#fb923c' : '#fff',
            },
        }
    ];

    return (
        <Layout className='min-h-screen'>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                style={{ position: 'fixed', height: '100vh', left: 0, backgroundColor: '#fb923c' }} // Make the Sider fixed with a consistent background
            >
                <div className="logo p-4 text-center text-white font-bold">
                    Logo {/* Replace with actual logo */}
                </div>
                <Menu
                    selectedKeys={[selectedKey]}
                    mode="inline"
                    className="bg-[#fb923c] text-white font-bold"
                    onClick={(e) => {
                        setSelectedKey(e.key);
                    }}
                    items={menuItems} // Use the `items` prop
                />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
                <Content>
                <StaffTracker/>
                    <BookingNotificationComponent></BookingNotificationComponent>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default StaffLayout;
