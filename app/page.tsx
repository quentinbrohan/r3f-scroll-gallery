"use client"

import { Canvas } from "@react-three/fiber"
import { Experience } from "@/components/Experience"
import { ScrollControls } from "@react-three/drei"
import Gallery from "@/components/Gallery"
import DOM from "@/components/DOM"
import GlobalScene from "@/components/GlobalScene"

export default function Home() {

  return (
    <>
      <DOM />
      <GlobalScene />
    </>
  )
}
