import React, { useContext, useEffect, useState } from "react";
import { notification } from "antd";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WebSocketContext } from "../../../services/config/provider/WebSocketProvider";
import db from "../NotificationIcon/DexieDB";
import { endAt } from "firebase/database";

const BookingNotificationComponent = () => {
  const { stompClient } = useContext(WebSocketContext);

  useEffect(() => {
    if (stompClient) {
      stompClient.subscribe("/user/queue/notifications", async (message) => {
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

          const staffEmails = booking.staff
            .map((staffMember) => staffMember.staffName)
            .join(", ");

          await db.notifications.add({
            bookingId: booking.id,
            service: booking.service.name,
            duration: booking.duration.durationInHours,
            createdDate: booking.createdDate,
            updatedDate: booking.updatedDate,
            startedAt: booking.startedAt,
            endAt: booking.endAt,
            address: booking.address,
            userEmail: booking.user.email,
            staffEmail: staffEmails,
            isRead: false,
            role: 'STAFF'
          })
        }
      });
    }
  });

  return null;
};

export default BookingNotificationComponent;