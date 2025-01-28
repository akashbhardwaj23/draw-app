import express from "express";
import userRouter from "./routes/user"
import roomRouter from "./routes/rooms"

require("dotenv").config()



const app = express();

app.use(express.json());

app.use("/api/v1", userRouter);
app.use("/api/v1/room", roomRouter)

app.listen(process.env.PORT, () => {
    console.log("Server Running at Port ", process.env.PORT)
})