"use client"

import { Canvas } from "@react-three/fiber"
import { Experience } from "@/components/Experience"
import { ScrollControls } from "@react-three/drei"

export default function Home() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas
        shadows
        camera={{
          position: [0, 0, 12],
          fov: 45,
          type: "PerspectiveCamera",
        }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#1a1a1a"]} />
        <ScrollControls pages={5} damping={0.1}>
          <Experience />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
