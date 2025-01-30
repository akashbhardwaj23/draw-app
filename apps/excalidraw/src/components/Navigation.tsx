"use client"

import Link from "next/link"
import { Paintbrush, Home, LogIn, UserPlus, LogOut } from "lucide-react"
import { Button } from "@repo/ui/button"
import { useAuth } from "../auth/useAuth"
import { usePathname } from "next/navigation"

export function Navigation() {
  const { token, logout } = useAuth();
  const pathName = usePathname();
 
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-xl font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              <Paintbrush className="h-8 w-8 mr-2" />
              <span>Excalidraw</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <>
            {
              pathName !== "/" ? <Link
              href="/"
              className="text-gray-600 hover:text-indigo-600 px-2 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Home size={24} />
            </Link> : <></>
            }
            </>
            {token ? (
              <>
                {/* <span className="text-gray-600">Welcome, {user.name}</span> */}
                <Button
                  className="text-gray-600 flex items-center hover:text-indigo-600 transition-colors"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin" passHref>
                  <Button className="text-gray-600 flex items-center hover:text-indigo-600 transition-colors">
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" passHref>
                  <Button className="bg-indigo-600 flex items-center p-2 rounded-md hover:bg-indigo-500 text-white transition-colors">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

