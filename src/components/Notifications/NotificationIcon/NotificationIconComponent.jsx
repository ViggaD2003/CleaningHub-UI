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

    const handleNotificationClick = async (id, bookingId) => {
        await db.notifications.update(id, { isRead: true });

        const updatedNotifications = await db.notifications.toArray();
        setNotifications(updatedNotifications);
        setUnreadCount(updatedNotifications.filter((noti) => !noti.isRead).length);


    }

    const notificationsContent = (
        <List
            dataSource={notifications}
            renderItem={(item) => (
                <List.Item
                    key={item.id}
                    style={{ opacity: item.isRead ? 0.6 : 1 }}
                >
                    <div>
                        <p><strong>Booking ID:</strong> {item.bookingId}</p>
                        <p><strong>Service:</strong> {item.service}</p>
                        <Button
                            type="link"
                            onClick={() => handleNotificationClick(item.id, item.bookingId)}
                        >
                            View Details
                        </Button>
                    </div>
                </List.Item>
            )}
        />
    )

    return (
        <Popover content={notificationsContent} title="Notifications" trigger="click">
            <Badge count={unReadCount}>
            <BellFilled style={{fontSize: '24px', cursor: 'pointer'}} />
            </Badge>
        </Popover>
    )
}