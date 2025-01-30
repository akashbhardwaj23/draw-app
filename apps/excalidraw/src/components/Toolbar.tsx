import type React from "react"
import { Paintbrush, Eraser, Trash2, Square, Circle, Minus, Type } from "lucide-react"
// import { ColorPicker } from "./ColorPicker"

interface ToolbarProps {
//   setColor: (color: string) => void
  setTool: (tool: "pen" | "eraser" | "shape" | "text") => void
  setShapeType: (shapeType: "rectangle" | "ellipse" | "line") => void
  setFontSize: (size: number) => void
  clearCanvas: () => void
//   color: string
  tool: "pen" | "eraser" | "shape" | "text"
  shapeType: "rectangle" | "ellipse" | "line"
  fontSize: number
}

const fontSizes = [12, 16, 20, 24, 28, 32]

export const Toolbar: React.FC<ToolbarProps> = ({
  setTool,
  setShapeType,
  setFontSize,
  clearCanvas,
//   color,
  tool,
  shapeType,
  fontSize,
}) => {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-10">
      <div className="flex items-center space-x-4">
        {/* <ColorPicker color={color} setColor={setColor} /> */}
        <div className="h-10 w-px bg-gray-300"></div>
        <div className="flex space-x-2">
          <button
            className={`p-2 rounded-lg transition-colors ${tool === "pen" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setTool("pen")}
          >
            <Paintbrush size={24} />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${tool === "eraser" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setTool("eraser")}
          >
            <Eraser size={24} />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${tool === "shape" && shapeType === "rectangle" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => {
              setTool("shape")
              setShapeType("rectangle")
            }}
          >
            <Square size={24} />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${tool === "shape" && shapeType === "ellipse" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => {
                console.log("assigning shape")
              setTool("shape")
              setShapeType("ellipse")
            }}
          >
            <Circle size={24} />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${tool === "shape" && shapeType === "line" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => {
              setTool("shape")
              setShapeType("line")
            }}
          >
            <Minus size={24} />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${tool === "text" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setTool("text")}
          >
            <Type size={24} />
          </button>
          <select
            className="p-2 rounded-lg bg-white border border-gray-300"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
          <button className="p-2 rounded-lg transition-colors hover:bg-gray-100" onClick={clearCanvas}>
            <Trash2 size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

