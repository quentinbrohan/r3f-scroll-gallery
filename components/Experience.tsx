"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useScroll } from "@react-three/drei"
import { MultiLevelCarousel } from "./MultiLevelCarousel"
import type * as THREE from "three"

export   // Sample images for each level
  const sampleImages = [
    // Level 1 - Nature
    [
      "/majestic-mountain-vista.png",
      "/forest-trees.png",
      "/ocean-waves.png",
      "/desert-dunes.png",
      "/lush-waterfall.png",
      "/sunset-sky.png",
    ],
    // Level 2 - Architecture
    [
      "/modern-building.png",
      "/glass-skyscraper.png",
      "/bridge-architecture.png",
      "/cathedral-interior.jpg",
      "/minimalist-house.jpg",
      "/vibrant-urban-cityscape.png",
    ],
    // Level 3 - Abstract
    [
      "/geometric-patterns.png",
      "/fluid-dynamics.jpg",
      "/abstract-digital-composition.png",
      "/color-gradients.jpg",
      "/abstract-shapes.png",
      "/abstract-particle-system.png",
    ],
    // Level 4 - Technology
    [
      "/intricate-circuit-board.png",
      "/data-visualization-abstract.png",
      "/holographic-display.png",
      "/robotic-arm.png",
      "/neural-network.png",
      "/quantum-computing-concept.png",
    ],
  ]

export const Experience = () => {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const lastScrollOffset = useRef(0)
  const scrollVelocity = useRef(0)

  useFrame((state, delta) => {
    if (groupRef.current) {
      const scrollProgress = scroll.offset
      const totalLevels = sampleImages.length
      const scrollRange = scrollProgress * (totalLevels - 1) * 5
      groupRef.current.position.y = scrollRange

      const currentScrollOffset = scroll.offset
      scrollVelocity.current = Math.abs(currentScrollOffset - lastScrollOffset.current) / delta
      lastScrollOffset.current = currentScrollOffset
    }
  })

  return (
    <group ref={groupRef}>
      {sampleImages.map((images, levelIndex) => (
        <MultiLevelCarousel
          key={levelIndex}
          images={images}
          position={[0, -levelIndex * 5, 0]}
          levelIndex={levelIndex}
          scrollVelocity={scrollVelocity.current} // Pass scroll velocity to carousels
          scrollProgress={scroll.offset} // Pass scroll progress for spiral effect
        />
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 10, 0]} intensity={0.8} />
      <pointLight position={[10, 0, 10]} intensity={0.3} />
      <pointLight position={[-10, 0, 10]} intensity={0.3} />
    </group>
  )
}
