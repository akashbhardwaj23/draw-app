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
        res.status(201).json({
            roomId : existingRoom.id
        });
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


router.get("/chat/:roomId", authMiddleware, async (req, res) => {
    const roomId = req.params.roomId || "";
    const messages = await client.chat.findMany({
        where : {
            roomId : Number(roomId)
        },
        select : {
         message : true
        },
        orderBy: {
            id : "desc"
        },
        take : 50
    });

    if(!messages){
        res.status(411).json({message : "No Message found"})
        return
    }

    console.log(messages)

    res.status(200).json({
        messages
    })

})



router.get("/room/:slug", authMiddleware, async (req, res) => {
    const slug = req.params.slug;

    const room = await client.room.findFirst({
        where: {
            slug
        }
    });

    if(!room){
        res.status(411).json({message : "No Room Found"});
        return
    }

    res.status(200).json({
        room
    })
})

router.put("/delete-chat/:roomId", async (req, res) => {
    const roomId = req.params.roomId || "";

   try {
    await client.$transaction([

        client.shapeMessage.deleteMany({
            where : {
                roomId : Number(roomId)
            }
        }),
        client.chat.deleteMany({
            where : {
                roomId: Number(roomId)
            }
        })
    ])

    res.status(200).json({
        message : "Deleted"
    })
   } catch (error) {
        console.log(error)
        res.status(200).json({
            message : "Error While Deleting"
        })
   }
})




export default router;