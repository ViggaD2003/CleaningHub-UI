import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { BellFilled } from "@ant-design/icons";
import { Badge, Button, List, Popover, Spin } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const NotificationIconComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const [unReadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const decodedToken = token ? jwtDecode(token) : null;
    const email = decodedToken?.sub;

    const fetchNotifications = async (pageNumber = 1, reset = false) => {
        if (!email) return;
        setLoading(true);
        try {
            const response = await axios.get(`/v1/notifications`, {
                params: { email: email, isUnread: filter === "unread", page: pageNumber, size: 5 },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const newNotifications = response.data.data;
            setNotifications((prevNotifications) => reset ? newNotifications : [...prevNotifications, ...newNotifications]);

            const unread = newNotifications.filter((item) => item.status === "unread").length;
            setUnreadCount(unread);

            setHasMore(newNotifications.length === 5); // Assume 5 is the page size, indicating more items may exist
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(1, true);
    }, [email, filter, token]);

    const handleNotificationClick = async (id, bookingId, type) => {
        await axios.put(
            `/v1/notifications/${id}`,
            {}, // Empty body
            {
                params: { status: "read" },
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

        setUnreadCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    };

    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        if (page > 1) {
            fetchNotifications(page);
        }
    }, [page]);

    const notificationsContent = (
        <div className="w-96 h-96 overflow-y-auto" onScroll={handleScroll}>
            <div className="flex gap-4 pb-5">
                <Button
                    type={filter === "all" ? "primary" : "default"}
                    onClick={() => {
                        setFilter("all");
                        setPage(1);
                    }}
                >
                    All
                </Button>
                <Button
                    type={filter === "unread" ? "primary" : "default"}
                    onClick={() => {
                        setFilter("unread");
                        setPage(1);
                    }}
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
            {loading && (
                <div className="flex justify-center mt-4">
                    <Spin />
                </div>
            )}
        </div>
    );

    return (
        <Popover content={notificationsContent} title="Notifications" trigger="click">
            <Badge count={unReadCount}>
                <BellFilled style={{ fontSize: '24px', cursor: 'pointer' }} />
            </Badge>
        </Popover>
    );
};

export default NotificationIconComponent;