import { WebSocketServer } from "ws";
import { verify } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/types"
import { userManager } from "./manager/UserManger";

const wss = new WebSocketServer({
    port : 8080
});


function checkAuthUser(token : string) : string | null {
  try {
    const decoded = verify(token, JWT_SECRET);

    if(!decoded || typeof decoded === "string" || !decoded.userId){
        return null;
    }

    return decoded.userId;

  } catch (error) {

    return null
  }
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
        return
    }

    userManager.addUser({
        userId,
        rooms : [],
        ws
    })

    ws.on("message", async (data : string) => {
        const message = JSON.parse(data);
        if(message.type === "join_room"){
           userManager.joinRoom(message.roomId, ws)
        }

        if(message.type === "leave_room"){
            userManager.leaveRoom(message.roomId, ws);
        }

        if(message.type === "chat"){
            const roomId = message.roomId;
            userManager.chat(roomId, ws, message, userId);
        }
    })

    ws.onclose = () => {
        userManager.leaveUser(ws);
    }
})