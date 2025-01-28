import { Router } from "express";
import { SignInInputs, SignUpInputs } from "@repo/common/zod";
import { client } from "@repo/db/client";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/types";


const router:Router = Router();

router.post("/signup", async (req, res) => {
    const success = SignUpInputs.safeParse(req.body);

    if(!success.success){
        res.status(401).json({message : "Inputs are not valid"})
        return;
    }

    const data = req.body;

   try {
        const existingUser = await client.user.findFirst({
            where : {
                email : data.email
            }
        });

        if(existingUser){
            res.status(401).json({message : "User already present"});
        }

        const hashedPassword = await bcrypt.hash(data.password, "7");

        const user = await client.user.create({
            data : {
                email : data.email,
                name : data.name,
                password : data.password
            }
        });
        
        const token = jwt.sign({userId : user.id}, JWT_SECRET);

        res.status(200).json({ token })
        return
   } catch (error) {
        res.status(403).json({message : "Unauthorized"})
   }
})


router.post("/signin", async (req, res) => {
    const parsedData = SignInInputs.safeParse(req.body);
    
    if(!parsedData.success){
        res.status(403).json({message : "Invalid data"});
        return
    }

    const data = req.body;
    try {
        const user = await client.user.findFirst({
            where : {
                email : data.email
            }
        })

        if(!user){
            res.status(403).json({message : "Unauthorized User"});
            return
        }

        const checkpassword = await bcrypt.compare(data.password, user.password);

        if(!checkpassword){
            res.status(403).json({message : "Invalid Password"});
            return
        }

        const token = jwt.sign({userId : user.id}, JWT_SECRET);
        

        res.status(200).json({ token });
        return
    } catch (error) {
        res.status(403).json({message : error})
    }
})

export default router;