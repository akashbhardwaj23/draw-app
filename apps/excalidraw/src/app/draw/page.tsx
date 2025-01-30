"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { Paintbrush } from "lucide-react"
import { Button } from "@repo/ui/button"
import { Navigation } from "@/components/Navigation"
import { useAuth } from "@/auth/useAuth"
import axios from "axios"
import { BACKEND_URL } from "@/utils/config"
import { useSocket } from "@/hooks/useSocket"

export default function RoomJoin() {
  const [roomName, setRoomName] = useState("")
  const router = useRouter();
  const token = localStorage.getItem("token") || "";
  const {socket} = useSocket();

  useEffect(() => {
      if(!token){
        redirect("/signin");
      }
  }, [])

  const handleJoinRoom = async () => {
    if (roomName.trim()) {
        const response = await axios.post(`${BACKEND_URL}/api/v1/create-room`, {
            name : roomName
        }, {
            headers : {
                Authorization : token
            }
        })
        const roomId = response.data.roomId;

        if (socket) {
          socket.onopen = (e) => {
           socket.send(JSON.stringify({
            type : "room_join",
            roomId
           }))
          }
        }
      
        router.push(`/canvas/${roomId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col">
      <Navigation />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center mb-8">
            <Paintbrush className="h-12 w-12 text-indigo-600 mr-4" />
            <h1 className="text-3xl font-bold text-indigo-800">Join a Room</h1>
          </div>
          <div className="space-y-6">
            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
                Room Name
              </label>
              <input
                id="roomName"
                type="text"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                required
              />
            </div>
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              onClick={handleJoinRoom}
            >
              Join Room
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

