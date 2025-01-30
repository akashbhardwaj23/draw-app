import Link from "next/link"
import { Paintbrush, Shapes, Type, Image, LogIn, UserPlus } from "lucide-react"
import { Button } from "@repo/ui/button"
import { Navigation } from "@/components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col">
      <Navigation />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-800 mb-4">Unleash Your Creativity</h1>
          <p className="text-2xl text-indigo-600">Create stunning diagrams and illustrations with ease</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-6xl">
          <FeatureCard icon={Paintbrush} title="Draw" description="Freehand drawing with customizable brush sizes" />
          <FeatureCard icon={Shapes} title="Shapes" description="Add perfect geometric shapes with a click" />
          <FeatureCard icon={Type} title="Text" description="Insert and edit text anywhere on your canvas" />
          <FeatureCard icon={Image} title="Export" description="Save your creations in various formats" />
        </div>

        <Link href="/draw" passHref>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Start Creating Now
          </Button>
        </Link>
      </main>

      <footer className="w-full bg-white bg-opacity-90 shadow-md mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-indigo-600">
          <p>© 2023 Excalidraw Clone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Icon className="h-12 w-12 text-indigo-500 mb-4 mx-auto" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

