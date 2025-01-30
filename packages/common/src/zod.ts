import { z } from "zod"



export const SignUpInputs = z.object({
    name : z.string(),
    email : z.string().email(),
    password : z.string()
})

export const SignInInputs = z.object({
    email : z.string().email(),
    password : z.string()
})

export const CreateRoomSchema = z.object({
    name : z.string()
})

export const ChatMessageSchema = z.object({
    type : z.enum(["Rectangle", "Square", "Ellipse"]),
    xPosition : z.number(),
    yPosition : z.number(),
    width : z.number(),
    height : z.number()
})