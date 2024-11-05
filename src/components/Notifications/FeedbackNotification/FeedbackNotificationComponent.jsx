import { notification } from "antd";
import { useContext, useEffect } from "react";
import { WebSocketContext } from "../../../services/config/provider/WebSocketProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FeedbackNotificationComponent = () => {
    const { stompClient } = useContext(WebSocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if stompClient is available before subscribing
        if (stompClient) {
            const subscription = stompClient.subscribe("/user/topic/feedbacks", async (message) => {
                if (message.body) {
                    const booking = JSON.parse(message.body);
                    const description = `
                            Your booking ${booking.id} is now ${booking.status}. Please feel free to share your feedback about
                            our service ${booking.service.name} and staff ${booking.staff.firstName} ${booking.staff.lastName}.
                    `;

                    notification.success({
                        message: 'Please share your feedback about our service',
                        description: (
                            <div>
                                {description}
                            </div>
                        ),
                        onClick: () => {
                            if (booking.status === "COMPLETED") {
                                navigate("/rating", { state: { bookingId: booking.id } });
                            }
                        },
                        duration: 10
                    });
                }
            });

            // Cleanup the subscription on component unmount
            return () => subscription.unsubscribe();
        }
    }, [stompClient, navigate]); // Add stompClient and navigate as dependencies

    return null;
};

export default FeedbackNotificationComponent;
