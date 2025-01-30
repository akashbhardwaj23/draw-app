"use client";
// import { ToolType, ShapeType } from "@/app/canvas/[roomId]/page";
import { drawCanvas } from "@/draw/canvasdraw";
import { useRef, useState, useEffect } from "react";
import { Toolbar } from "./Toolbar";
import { ShapeType, ToolType } from "@/utils/type";
import { useSocket } from "@/hooks/useSocket";

export default function RoomCanvasClient({ roomId }: { roomId: string }) {
  const { socket, loading } = useSocket();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<ToolType>("shape");
  const [shapeType, setShapeType] = useState<ShapeType>("Rectangle");
  const [fontSize, setFontSize] = useState<number>(16);

  const clearCanvas = () => {
    //Todo fix it
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,0,0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    if (!loading && socket && canvasRef.current) {
      console.log("Socket is ", socket);
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );

      drawCanvas(canvasRef.current, shapeType, roomId, socket);

      console.log(shapeType);
    }
  }, [loading, socket, roomId]);

  return (
    <div className="h-full w-full">
      <Toolbar
        setFontSize={setFontSize}
        setShapeType={setShapeType}
        fontSize={fontSize}
        shapeType={shapeType}
        tool={tool}
        setTool={setTool}
        clearCanvas={clearCanvas}
      />
      <canvas ref={canvasRef} width={2000} height={1000}></canvas>
    </div>
  );
}
