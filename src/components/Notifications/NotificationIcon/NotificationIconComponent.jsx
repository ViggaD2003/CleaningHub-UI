import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { BellFilled } from "@ant-design/icons";
import { Badge, Button, List, Popover } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const NotificationIconComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const [unReadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const decodedToken = token ? jwtDecode(token) : null;
    const email = decodedToken.sub;

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!email) return;
            try {
                const response = await axios.get(`/v1/notifications`, {
                    params: { email: email, isUnread: filter === "unread" },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log(response);

                setNotifications(response.data.data);

                const unread = response.data.data.filter((item) => item.status === "unread").length;
                setUnreadCount(unread);
            } catch (error) {
                error(error);
            }
        };

        fetchNotifications();
    }, [email, filter, token]);

    const handleNotificationClick = async (id, bookingId, type) => {
        await axios.put(
            `/v1/notifications/${id}`,
            {}, // Empty body
            {
                params: { status: "read" }, // Add status as a query parameter
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (type === "feedback") {
            navigate(`/rating`, { state: { bookingId: bookingId } });
        } else if (type === "booking") {
            navigate(`/bookings/booking/${bookingId}`);
        }

        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === id ? { ...notification, status: "read" } : notification
            )
        );

        setUnreadCount(notifications.length - 1);
    };

    const notificationsContent = (
        <>
            <div className="w-96 h-auto overflow-y-auto">
                <div className="flex gap-4 pb-5">
                    <Button
                        type={filter === "all" ? "primary" : "default"}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </Button>
                    <Button
                        type={filter === "unread" ? "primary" : "default"}
                        onClick={() => setFilter("unread")}
                    >
                        Unread
                    </Button>
                </div>
                <List
                    dataSource={notifications}
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                            style={{
                                backgroundColor: item.isRead ? "#f0f0f0" : "#e6f7ff",
                                borderRadius: "8px",
                                padding: "10px",
                                marginBottom: "8px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                cursor: "pointer",
                                opacity: item.isRead ? 0.6 : 1
                            }}
                            onClick={() => handleNotificationClick(item.id, item.bookingId, item.type)}
                        >
                            <div>
                                {item.message}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </>
    );


    return (
        <Popover content={notificationsContent} title="Notifications" trigger="click">
            <Badge count={unReadCount}>
                <BellFilled style={{ fontSize: '24px', cursor: 'pointer' }} />
            </Badge>
        </Popover>
    )
}

export default NotificationIconComponent;