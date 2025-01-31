import { BACKEND_URL } from "@/utils/config";
import axios from "axios";

type Shape = {
  type: "Rectangle" | "Ellipse" | "Line";
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
};

type ShapeType = "Rectangle" | "Ellipse" | "Line";

export class Draw {
  private static instance: Draw;
  private shape: ShapeType;
  private existingShapes: Shape[];
  private ctx: CanvasRenderingContext2D | null;
  private constructor() {
    this.shape = "Rectangle"
    this.existingShapes = []
    this.ctx = null
  }

  public static getInstance() {
    if (!Draw.instance) {
      Draw.instance = new Draw();
      return Draw.instance;
    }
    return Draw.instance;
  }

  public setShape(shape: ShapeType) {
    this.shape = shape;
  }

  public async drawCanvas(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket
  ) {
    //@ts-ignore
    this.ctx = canvas.getContext("2d");

    this.existingShapes = await getExistingShapes(roomId);

    if (!this.ctx) {
      return;
    }

    socket.onmessage = (ev) => {
      const message = JSON.parse(ev.data);
      console.log(message);
      if (message.type === "chat") {
        this.existingShapes.push(message.chat);
        console.log("Existing Shapes ", this.existingShapes);
        this.clearCanvas(canvas);
      }

      if(message.type === "delete-chat"){
        console.log("Working on this")
        // Make this work the other way
        // this.existingShapes = []
        // this.existingShapes = 
        const shapes = message.updatedShape.message;
        console.log(message)
        this.existingShapes = shapes
        this.clearCanvas(canvas);
      }
    };

    this.clearCanvas(canvas);
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
    });

    canvas.addEventListener("mouseup", (e) => {
      clicked = false;
      const width = e.clientX - startX;
      const height = e.clientY - startY;

      console.log(this.shape);
      this.existingShapes.push({
        type: this.shape,
        xPosition: startX,
        yPosition: startY,
        width,
        height,
      });
      console.log("Sending to socket");
      socket.send(
        JSON.stringify({
          type: "chat",
          roomId,
          chat: {
            type: this.shape,
            xPosition: startX,
            yPosition: startY,
            width: width,
            height: height,
          },
        })
      );
    });

    canvas.addEventListener("mousemove", (e) => {
      if (clicked && this.ctx) {
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        this.clearCanvas(canvas);
        this.ctx.strokeStyle = "rgba(255,255,255)";
        if (this.shape === "Rectangle") {
          this.ctx.strokeRect(startX, startY, width, height);
        }

        if (this.shape === "Ellipse") {
          let radius = Math.sqrt(width * width + height * height);
          this.ctx.beginPath();
          this.ctx.arc(startX, startX, radius, 0, Math.PI * 2);
          this.ctx.stroke();
        }
      }
    });
  }

  private clearCanvas(
    canvas: HTMLCanvasElement,
  ) {

    if(!this.ctx){
      return
    }

    console.log("Existing Shape ", this.existingShapes)
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0)";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.existingShapes?.map((shape) => {
      if (shape.type === "Rectangle") {
        this.ctx!.strokeStyle = "rgba(255, 255, 255)";
        this.ctx!.strokeRect(
          shape.xPosition,
          shape.yPosition,
          shape.width,
          shape.height
        );
      }
      if (shape.type === "Ellipse") {
        console.log("Drawing ellipse");
        const radius = Math.sqrt(
          shape.width * shape.width + shape.height * shape.height
        );
        this.ctx!.strokeStyle = "rgba(255, 255, 255)";
        this.ctx!.beginPath();
        this.ctx!.arc(shape.xPosition, shape.xPosition, radius, 0, 2 * Math.PI);
        this.ctx!.stroke();
      }
    });
  }

  public async remove(canvas: HTMLCanvasElement, roomId: string) {
    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/delete-chat/${roomId}`
      );
      this.existingShapes = [];
      this.clearCanvas(canvas);
    } catch (error) {
      console.log(error);
    }
  }
}

export const initDraw = Draw.getInstance();

async function getExistingShapes(roomId: string) {
  const token = localStorage.getItem("token") || "";
  console.log(token);
  const response = await axios.get(`${BACKEND_URL}/api/v1/chat/${roomId}`, {
    headers: {
      Authorization: token,
    },
  });
  const messages = response.data.messages;

  console.log("Message is ", messages);

  const shapes = messages?.map((x: { message: string }) => {
    console.log(x.message);
    const messageData = x.message;
    return messageData;
  });

  console.log("Shapes is ", shapes);

  return shapes;
}
