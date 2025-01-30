



export type ChatType = {
    type : "Rectangle" | "Square" | "Ellipse",
    xPostion : number,
    yPosition : number,
    width : number,
    height : number
}


export type MessageType  = {
    type : "join_room",
    roomId : string
} | {
    type : "leave_room",
    roomId : string
} 

export type ChatMessageType =  {
    type : "chat",
    chat : ChatType,
    roomId : string
}