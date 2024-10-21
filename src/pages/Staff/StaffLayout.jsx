import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, message, Space } from 'antd';
import { UserOutlined, LaptopOutlined, BookOutlined, MessageOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // Import Ant Design styles
import { Content, Header } from "antd/es/layout/layout";
import { Outlet, Link, useNavigate } from "react-router-dom";
import BookingNotificationComponent from '../../components/BookingNotification/BookingNotificationComponent';
import { jwtDecode } from 'jwt-decode'; // Correct import

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

    const customFontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

    // Define the menu items using the `items` prop with icons
    const menuItems = [
        {
            key: '1',
            label: (
                <Dropdown
                    menu={{
                        items: [
                            { key: 'profile', label: <Link to="/staff/getInformation">Profile</Link>, icon: <UserOutlined /> },
                            { key: 'logout', label: <div style={{ backgroundColor: 'red', padding: 10 }}><Link to="/staff/logout">Logout</Link></div>, icon: <LogoutOutlined /> },
                        ],
                    }}
                    trigger={['click']}
                >
                    <a
                        onClick={(e) => e.preventDefault()}
                        className="text-white flex space-x-2"
                        style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            fontFamily: customFontFamily,
                            display: 'block',
                        }}
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
            label: <Link to="/staff/dashboard">Dashboard</Link>,
            style: {
                backgroundColor: selectedKey === '2' ? 'white' : 'transparent',
                color: selectedKey === '2' ? '#fb923c' : '#fff',
            },
        },
        {
            key: '3',
            icon: <BookOutlined />,
            label: <Link to="/staff/bookings">Bookings</Link>,
            style: {
                backgroundColor: selectedKey === '3' ? 'white' : 'transparent',
                color: selectedKey === '3' ? '#fb923c' : '#fff',
            },
        },
        {
            key: '4',
            icon: <MessageOutlined />,
            label: <Link to="/staff/feedbacks">Feedbacks</Link>,
            style: {
                backgroundColor: selectedKey === '4' ? 'white' : 'transparent',
                color: selectedKey === '4' ? '#fb923c' : '#fff',
            },
        },
    ];

    return (
        <Layout className='min-h-screen'>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                style={{ position: 'fixed', height: '100vh', left: 0, backgroundColor: '#fb923c' }} // Make the Sider fixed with a consistent background
            >
                <div className="logo p-4 text-center text-white font-bold" style={{ fontFamily: customFontFamily }}>
                    Logo {/* Replace with actual logo */}
                </div>
                <Menu
                    selectedKeys={[selectedKey]}
                    mode="inline"
                    style={{
                        backgroundColor: '#fb923c',
                        borderRight: 0,
                        fontFamily: customFontFamily,
                        fontSize: '16px', // Set font size for all menu items
                        fontWeight: 'bold', // Set font weight to bold
                        color: '#ffffff' // Set the default text color to white
                    }}
                    onClick={(e) => {
                        setSelectedKey(e.key);
                    }}
                    items={menuItems} // Use the `items` prop
                />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
                <Content>
                    <BookingNotificationComponent />
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default StaffLayout;
