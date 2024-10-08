import React, { useEffect, useState } from "react";
import { notification } from "antd";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const BookingNotificationComponent = () => {
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // Kết nối tới WebSocket server qua SockJS
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    const jwtToken = localStorage.getItem('token');

    stompClient.connect({ Authorization: `Bearer ${jwtToken}` }, (frame) => {
      console.log("Connected: " + frame);

      // Đăng ký lắng nghe thông báo dành cho staff với đường dẫn /user/topic/notifications
      stompClient.subscribe("/user/queue/notifications", (message) => {
        console.log(message);
        if (message.body) {
          const booking = JSON.parse(message.body);
          console.log(booking);

          notification.success({
            message: 'New Booking Information',
            description: (
              <div>
                <p><strong>Booking ID:</strong> {booking.id}</p>
                <p><strong>Service:</strong> {booking.service.name}</p>
                <p><strong>Duration:</strong> {booking.duration.durationInHours} hours</p>
                <p><strong>User:</strong> {booking.user.email}</p>
                <p><strong>Started At:</strong> {booking.startedAt}</p>
                <p><strong>End At:</strong> {booking.endAt}</p>
              </div>
            ),
            duration: 10
          });
        }
      });
    });

    setStompClient(stompClient);

    // Cleanup khi component unmount
    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("Disconnected");
        });
      }
    };
  }, []);

  return null;
};

export default BookingNotificationComponent;
