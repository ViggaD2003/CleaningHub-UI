import React, { useContext, useEffect, useState } from "react";
import { notification } from "antd";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WebSocketContext } from "../../../services/config/provider/WebSocketProvider";
import { endAt } from "firebase/database";
import axios from "axios";

const BookingNotificationComponent = () => {
  const { stompClient } = useContext(WebSocketContext);

  useEffect(() => {
    if (stompClient) {
      stompClient.subscribe("/user/queue/notifications", async (message) => {
        if (message.body) {
          const booking = JSON.parse(message.body);
          const description = `You have a new booking ${booking.id} on{" "}
                ${booking.startedAt} for ${booking.service.name}.`;

          notification.success({
            message: 'New Booking Information',
            description: (
              <div>
                {description}
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