import express from "express";
import userRouter from "./routes/user"

require("dotenv").config()



const app = express();

app.use(express.json());

app.use("api/v1", userRouter);

app.listen(process.env.PORT, () => {
    console.log("Server Running at Port ", process.env.PORT)
})