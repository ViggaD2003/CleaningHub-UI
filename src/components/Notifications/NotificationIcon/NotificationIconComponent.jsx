import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import db from "./DexieDB";
import { BellFilled } from "@ant-design/icons";
import { Badge, Button, List, Popover } from "antd";

const NotificationIconComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const [unReadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            const allNotis = await db.notifications.toArray();
            setNotifications(allNotis);
            setUnreadCount(allNotis.filter((noti) => !noti.isRead).length);
        };

        fetchNotifications();
    }, []);

    const handleNotificationClick = async (id, bookingId, role) => {
        await db.notifications.update(id, { isRead: true });

        const updatedNotifications = await db.notifications.toArray();
        setNotifications(updatedNotifications);
        setUnreadCount(updatedNotifications.filter((noti) => !noti.isRead).length);

        if (role === "USER") {
            navigate("/rating",{ state: { bookingId: bookingId } });
        } else if (role === "STAFF") {
            navigate(`/staff/bookings/booking/${bookingId}`);
        }
    }

    const notificationsContent = (
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
                    onClick={() => handleNotificationClick(item.id, item.bookingId, item.role)}
                >
                    <div>
                        <p>
                            You have a new booking <strong>{item.bookingId} </strong>
                            starting at <strong>{item.startedAt}</strong> with service
                            <strong> {item.service}</strong>.
                        </p>
                    </div>
                </List.Item>
            )}
        />
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