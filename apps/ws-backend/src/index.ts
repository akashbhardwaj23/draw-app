import { WebSocketServer } from "ws";
import { verify } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/types"

const wss = new WebSocketServer({
    port : 3002
})

function checkAuthUser(token : string) : string | null {
    const decoded = verify(token, JWT_SECRET);

    if(!decoded || typeof decoded === "string" || !decoded.userId){
        return null;
    }

    return decoded.userId
}

wss.on("connection", (ws, request) => {
    const url = request.url;
    if(!url){
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);

    const token = queryParams.get("token") || "";   
    const userId = checkAuthUser(token);
    if(!userId){
        ws.close();
        return;
    }

    ws.on("message", (data : string) => {
        const message = JSON.parse(data);
        
    })
})