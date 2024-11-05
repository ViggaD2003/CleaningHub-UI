import React, { createContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const jwtToken = localStorage.getItem("token"); 

    useEffect(() => {
        if (jwtToken) { 
            const socket = new SockJS("https://ch-api.arisavinh.dev/ws");
            const client = Stomp.over(socket);

            client.connect({ Authorization: `Bearer ${jwtToken}` }, (frame) => {
                setStompClient(client);
            });

            return () => {
                if (client) client.disconnect();
            };
        }
    }, [jwtToken]);

    return (
        <WebSocketContext.Provider value={{ stompClient }}>
            {children}
        </WebSocketContext.Provider>
    );
};
