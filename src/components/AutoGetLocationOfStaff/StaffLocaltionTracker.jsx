import React, { useEffect } from "react";
import useAuth from "../../services/config/provider/useAuth";
import axiosClient from "../../services/config/axios";

const StaffLocationTracker = () => {
    const { auth } = useAuth();

    useEffect(() => {
        // Chỉ chạy khi role là "ROLE_STAFF"
        if (auth?.role === "ROLE_STAFF") {
            // Cập nhật vị trí mỗi 60 giây
            const intervalId = setInterval(updateLocation, 60000);

            // Cleanup interval khi component bị unmount
            return () => clearInterval(intervalId);
        }
    }, [auth]); // Chỉ chạy khi auth thay đổi

    const updateLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Gửi yêu cầu cập nhật vị trí đến backend
                    axiosClient
                        .patch("/v1/users/update-location-staff", {
                            latitude: lat,
                            longitude: lon
                        })
                        .then((response) => {
                            console.log("Location updated:", response.data);
                        })
                        .catch((error) => {
                            console.error("Error updating location:", error);
                        });
                },
                (error) => {
                    console.error("Geolocation error:", error.message);
                }
            );
        } else {
            console.log("Trình duyệt không hỗ trợ Geolocation.");
        }
    };

    return null; // Component này chỉ thực hiện tác vụ background, không cần render UI
};

export default StaffLocationTracker;
