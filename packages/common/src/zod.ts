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