import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { CreateRoomSchema } from "@repo/common/zod";
import { client } from "@repo/db/client";


const router:Router = Router();

router.post("/create-room", authMiddleware, async (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success){
        res.status(403).json({message : "Invalid Inputs"});
        return;
    }

    const existingRoom = await client.room.findFirst({
        where : {
            slug : data.data.name
        }
    });

    if(existingRoom){
        res.status(401).json({message : "Room Already Exits"});
        return;
    }
    const userId = req.userId || "";
    
    const room = await client.room.create({
        data : {
            slug : data.data.name,
            adminId : userId
        }
    })


    res.status(200).json({
        roomId : room.id
    })
})




export default router;