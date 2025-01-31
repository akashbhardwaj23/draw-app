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
        // const existingUser = this.users.find((user) => user.userId === newUser.userId)
        // console.log("Existing user", existingUser)
        // if(existingUser){
        //     return;
        // }
        this.users.push(newUser);
        console.log("Users ", this.users.length)
    }

    public joinRoom(roomId : string, ws : WebSocket){
        const user = this.users.find((x) => x.ws === ws);

        const existingRoom = user?.rooms.find(room => room === roomId)
        console.log("Existing Room ",existingRoom)
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
            console.log("In Parsed Chat");
            if(!parsedChat.success){
                ws.close();
                console.log("Returning")
                return;
            }

            const chat = parsedChat.data;
            const myRoomId = Number(roomId);
                          
            console.log("Users ", this.users)
            console.log("Before Prisma invocation on chat")
            //TODO - PUT THIS IN A QUEUE
            await client.chat.create({
                data : {
                    roomId : myRoomId,
                    message : {
                        create : {
                            type : chat.type,
                            xPosition : chat.xPosition,
                            yPosition : chat.yPosition,
                            width : chat.width,
                            height : chat.height,
                            roomId : Number(roomId)
                        }
                    },
                    userId,
                },
            })

            console.log("After Prisma invocation on chat")
            console.log(roomId)
            this.users.forEach((user) => {
                if(user.rooms.includes(roomId)){
                    console.log("sending message to everyone in room ", roomId)
                    user.ws.send(JSON.stringify({
                        type : "chat",
                        chat,
                        roomId
                    }))
                }
            })

            console.log("Message Sent")
        
    }

    public async deleteChat(roomId: string){
        const updatedShape = await client.chat.findMany({
            where : {
                roomId : Number(roomId)
            },
            select : {
                message : true
               }
        })
        this.users.forEach((user) => {
            if(user.rooms.includes(roomId)){
                console.log("sending Delete Message in room ", roomId)
                user.ws.send(JSON.stringify({
                    type : "delete-chat",
                    roomId,
                    updatedShape
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