"use client"
import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8080";
 
export function useSocket() {
    const [socket, setSocket] = useState<WebSocket>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=${localStorage.getItem("token")}`)
        setLoading(true)
        ws.onopen = () => {
            setSocket(ws)
            setLoading(false)
        }

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setLoading(false);
          };
        
        return () => {
            socket?.close();
        };
    }, []);

    return {socket, loading};
}