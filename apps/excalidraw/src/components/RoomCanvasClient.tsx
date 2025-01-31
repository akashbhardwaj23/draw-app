"use client";
// import { ToolType, ShapeType } from "@/app/canvas/[roomId]/page";
import {  initDraw } from "@/draw/canvasdraw";
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

    if(canvasRef.current) initDraw.remove(canvasRef.current, roomId);
    socket?.send(JSON.stringify({
      type : "delete-chat",
      roomId
    }))
  };

  useEffect(() => {
    initDraw.setShape(shapeType);
  }, [shapeType])

  useEffect(() => {
    if (!loading && socket && canvasRef.current) {
      console.log("Socket is ", socket);
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );

      initDraw.drawCanvas(canvasRef.current, roomId, socket);

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
