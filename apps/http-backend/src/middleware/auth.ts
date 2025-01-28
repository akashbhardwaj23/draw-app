import { NextFunction, Request, RequestHandler, Response } from "express";
import { verify } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/types"


const middleware = () =>  async (req : Request, res : Response, next : NextFunction) => {
    try {
        const token = req.headers.authorization;
        if(!token){
            res.status(403).json({message : "Unauthorized"});
            return
        }

        const decoded = verify(token, JWT_SECRET);

        if(typeof decoded === "string"){
             res.status(403).json({message : "Unauthorized"});
             return
        }
        //@ts-ignore
        req.userId = decoded.userId
        next()
    } catch (error) {
        res.status(403).json({message : "Unauthorized"});
        return
    }
}

export const authMiddleware: RequestHandler = middleware();