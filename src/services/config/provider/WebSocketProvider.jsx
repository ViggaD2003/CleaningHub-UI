import React, { createContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);
        const jwtToken = localStorage.getItem("token");

        client.connect({ Authorization: `Bearer ${jwtToken}` }, (frame) => {
            setStompClient(client);
            console.log("Connected to WebSocket server");
        });

        // Cleanup on component unmount
        return () => {
            if (client) client.disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ stompClient }}>
            {children}
        </WebSocketContext.Provider>
    );
};
