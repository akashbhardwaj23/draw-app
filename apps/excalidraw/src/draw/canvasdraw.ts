





import { BACKEND_URL } from "@/utils/config";
import axios from "axios";



type Shape = {
   type : "Rectangle",
   xPosition : number,
   yPosition : number,
   width : number,
   height : number
} | {
    type : "Ellipse",
    centerX : number,
    centerY : number,
    radius : number
}

type ShapeType = "Rectangle" | "Ellipse" | "Line"

export async function drawCanvas(canvas : HTMLCanvasElement, shape : ShapeType, roomId : string, socket : WebSocket ){
        const ctx = canvas.getContext("2d");
            
        let existingShapes:Shape[] = await getExistingShapes(roomId);; 

            if(!ctx){
                return
            }


            socket.onmessage = (ev) => {
                const message = JSON.parse(ev.data);
                console.log(message)
                if(message.type === "chat"){
                    existingShapes.push(message.chat);
                    console.log("Existing Shapes ",existingShapes)
                    clearCanvas(existingShapes, canvas, ctx)
                }
            }
            
            clearCanvas(existingShapes, canvas, ctx)
            // console.log(shape)
           
            // ctx.fillStyle = "rgba(0,0,0)"
            // ctx.fillRect(0, 0, canvas.width, canvas.height); 


            let clicked = false;
            let startX = 0;
            let startY = 0;

            canvas.addEventListener("mousedown", (e) => {
                clicked = true;
                startX = e.clientX;
                startY = e.clientY;
            })

            canvas.addEventListener("mouseup", (e) => {
                clicked = false
                const width = e.clientX - startX;
                const height = e.clientY - startY;
                existingShapes.push({
                    type : "Rectangle",
                    xPosition : startX,
                    yPosition : startY,
                    width,
                    height
                });
                        if(socket){
                            console.log("Sending to socket")
                            socket.send(JSON.stringify({
                                type : "chat",
                                roomId,
                                chat : {
                                    type : shape,
                                    xPosition : startX,
                                    yPosition : startY,
                                    width : width,
                                    height : height
                                }
                            }))
                        }
            })

            canvas.addEventListener("mousemove", (e) => {
                if(clicked){
                    const width = e.clientX - startX;
                    const height = e.clientY - startY;
                    clearCanvas(existingShapes, canvas, ctx)
                    ctx.strokeStyle = "rgba(255,255,255)"
                    if(shape === "Rectangle"){
                        ctx.strokeRect(startX, startY, width, height);
                    }

                    if(shape === "Ellipse"){
                        let radius = Math.sqrt(width * width + height * height);
                        ctx.beginPath();
                        ctx.arc(startX, startX, radius, 0, Math.PI*2)
                        ctx.stroke()
                    }
                }
            })

}


function clearCanvas(existingShapes : Shape[],canvas : HTMLCanvasElement, ctx:CanvasRenderingContext2D){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    existingShapes?.map((shape) => {
        if(shape.type === "Rectangle"){
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.strokeRect(shape.xPosition, shape.yPosition, shape.width, shape.height)
        }
        if(shape.type === "Ellipse"){
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0*Math.PI, 1.5*Math.PI)
        }
    })
}


async function getExistingShapes(roomId : string){

    const token = localStorage.getItem("token") || ""
    console.log(token)
    const response = await axios.get(`${BACKEND_URL}/api/v1/chat/${roomId}`, {
        headers : {
            Authorization : token
        }
    });
    const messages = response.data.messages;

    console.log("Message is ",messages)

    const shapes = messages?.map((x: {message : string}) => {
        console.log(x.message)
        const messageData = x.message;
        return messageData
    })

    console.log("Shapes is ",shapes)

    
    return shapes;
}   