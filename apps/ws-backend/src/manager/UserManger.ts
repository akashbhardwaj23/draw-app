import { ChatMessageSchema } from "@repo/common/zod";
import WebSocket from "ws";
import { ChatMessageType } from "../type";
import { client } from "@repo/db/client";

interface Users {
    ws : WebSocket,
    rooms : string[],
    userId : string
}


export class UserManager {
    private static instance : UserManager
    private users : Users[] = [];

    private constructor(){
    }

    public static getInstance(){
        if(!UserManager.instance){
            UserManager.instance = new UserManager();
            return UserManager.instance;
        }
        return UserManager.instance
    }

    public addUser(newUser : Users){
        const existingUser = this.users.find((user) => user.userId === newUser.userId)
        if(!existingUser){
            return;
        }
        this.users.push(newUser);
    }

    public joinRoom(roomId : string, ws : WebSocket){
        const user = this.users.find((x) => x.ws === ws);

        const existingRoom = user?.rooms.find(room => room === roomId)

        if(existingRoom){
            return;
        }
        user?.rooms.push(roomId);
    }

    public leaveRoom(roomId : string, ws: WebSocket){
        const user =  this.users.find((x) => x.ws === ws);
        if(!user){
            return;
        }
        user.rooms = user.rooms.filter((room) => room !== roomId);
    }

    public async chat(roomId : string, ws:WebSocket, message : ChatMessageType, userId : string){
            const parsedChat = ChatMessageSchema.safeParse(message.chat);
            if(!parsedChat.success){
                ws.close();
                return;
            }

            const chat = parsedChat.data;


            const myRoomId = Number(roomId);
                          
            console.log("Before Prisma invocation on chat")
            //TODO - PUT THIS IN A QUEUE
            await client.chat.create({
                data : {
                    roomId : myRoomId,
                    message : {
                        create : {
                            type : chat.type,
                            xPosition : chat.xPosition,
                            yPostion : chat.yPosition,
                            width : chat.width,
                            height : chat.height
                        }
                    },
                    userId,
                },
            })

            console.log("After Prisma invocation on chat")

            this.users.forEach((user) => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        types : "chat",
                        chat,
                        roomId
                    }))
                }
            })

            console.log("Message Sent")
        
    }

    public leaveUser(ws : WebSocket){
        this.users = this.users.filter(x => x.ws !== ws);
    }


}



export const userManager = UserManager.getInstance();