import React, { useContext, useEffect, useState } from "react";
import { notification } from "antd";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WebSocketContext } from "../../../services/config/provider/WebSocketProvider";

const BookingNotificationComponent = () => {
  const { stompClient } = useContext(WebSocketContext);

  useEffect(() => {
    if (stompClient) {
      stompClient.subscribe("/user/queue/notifications", (message) => {
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
    }
  });

  return null;
};

export default BookingNotificationComponent;
