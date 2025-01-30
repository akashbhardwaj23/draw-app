import { WS_URL } from "@/utils/config";
import { useEffect, useState } from "react";




export function useSocket(){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if(!socket){
            const newSocket = new WebSocket(WS_URL);
            setSocket(newSocket);
        }

        setLoading(false)
    }, [socket])


    return {
        socket,
        loading
    }
}