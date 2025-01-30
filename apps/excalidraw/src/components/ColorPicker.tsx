// import type React from "react"
// import { useState } from "react"
// // import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// interface ColorPickerProps {
//   color: string
//   setColor: (color: string) => void
// }

// const colors = [
//   "#FF6B6B",
//   "#4ECDC4",
//   "#45B7D1",
//   "#FFA07A",
//   "#98D8C8",
//   "#F06292",
//   "#AED581",
//   "#FFD54F",
//   "#FF0000",
//   "#00FF00",
//   "#0000FF",
//   "#FFFF00",
//   "#FF00FF",
//   "#00FFFF",
//   "#800000",
//   "#008000",
//   "#000080",
//   "#808000",
//   "#800080",
//   "#008080",
//   "#FFA500",
//   "#FFC0CB",
//   "#A52A2A",
//   "#808080",
// ]

// export const ColorPicker: React.FC<ColorPickerProps> = ({ color, setColor }) => {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//     <Popover open={isOpen} onOpenChange={setIsOpen}>
//       <PopoverTrigger asChild>
//         <button
//           className="w-10 h-10 rounded-lg border-2 border-gray-300 transition-transform hover:scale-110"
//           style={{ backgroundColor: color }}
//         />
//       </PopoverTrigger>
//       <PopoverContent className="w-64 p-2">
//         <div className="grid grid-cols-6 gap-2">
//           {colors.map((c) => (
//             <button
//               key={c}
//               className="w-8 h-8 rounded-full transition-transform hover:scale-110"
//               style={{ backgroundColor: c }}
//               onClick={() => {
//                 setColor(c)
//                 setIsOpen(false)
//               }}
//             />
//           ))}
//         </div>
//       </PopoverContent>
//     </Popover>
//   )
// }

