"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { useFrame, useLoader, useThree } from "@react-three/fiber"
import { useScroll } from "@react-three/drei"
import * as THREE from "three"

interface MultiLevelCarouselProps {
  images: string[]
  position: [number, number, number]
  levelIndex: number
  scrollVelocity: number // Added scroll velocity prop
  scrollProgress: number // Added scroll progress prop
}

export const MultiLevelCarousel = ({
  images,
  position,
  levelIndex,
  scrollVelocity,
  scrollProgress,
}: MultiLevelCarouselProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const { gl } = useThree()
  const scroll = useScroll()

  // Carousel state
  const rotationRef = useRef(0)
  const velocityRef = useRef(0)
  const isDragging = useRef(false)
  const lastMouseX = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Load textures
  const textures = useLoader(THREE.TextureLoader, images)

  // Set correct color space for all textures
  useMemo(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
    })
  }, [textures])

  // Carousel settings
  const baseRadius = 5
  const imageWidth = 3.2 // 16:9 ratio width
  const imageHeight = 1.8 // 16:9 ratio height
  const friction = 0.95
  const wheelSensitivity = 0.002
  const dragSensitivity = 0.005

  const rotationDirection = levelIndex % 2 === 0 ? 1 : -1 // Even indices clockwise, odd counter-clockwise
  const baseRotationSpeed = 0.1 // Base rotation speed

  const getDynamicRadius = () => {
    const scrollForce = Math.min(scrollVelocity * 100, 1) // Normalize scroll force
    const minRadius = 2.5 // Minimum radius when planes are almost touching
    return baseRadius - (baseRadius - minRadius) * scrollForce
  }

  // Mouse wheel handler
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    const wheelForce = event.deltaY * wheelSensitivity * 0.00001
    velocityRef.current += wheelForce
  }

  // Mouse drag handlers
  const handleMouseDown = (event: MouseEvent) => {
    isDragging.current = true
    lastMouseX.current = event.clientX
    gl.domElement.style.cursor = "grabbing"
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging.current) return

    const deltaX = event.clientX - lastMouseX.current
    const dragForce = deltaX * dragSensitivity * 0.00001
    velocityRef.current += dragForce
    lastMouseX.current = event.clientX
  }

  const handleMouseUp = () => {
    isDragging.current = false
    gl.domElement.style.cursor = "grab"
  }

  // Event listeners setup
  useEffect(() => {
    const canvas = gl.domElement

    canvas.style.cursor = "grab"
    canvas.addEventListener("wheel", handleWheel, { passive: false })
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mouseleave", handleMouseUp)

    return () => {
      canvas.removeEventListener("wheel", handleWheel)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mouseleave", handleMouseUp)
    }
  }, [gl.domElement])

  // Animation loop
  useFrame((state, delta) => {
    if (groupRef.current) {
      const scrollProgress = scroll.offset
      const totalLevels = 4 // We have 4 levels
      const levelProgress = scrollProgress * (totalLevels - 1)
      const distanceFromCenter = Math.abs(levelProgress - levelIndex)
      const visibilityFactor = Math.max(0.1, 1 - distanceFromCenter) // Reduce speed when most visible

      if (!isDragging.current && Math.abs(velocityRef.current) < 0.001) {
        // Add slow automatic rotation based on index direction and visibility
        const autoRotationSpeed = baseRotationSpeed * rotationDirection * visibilityFactor * delta
        rotationRef.current += autoRotationSpeed
      }

      // Apply friction to manual interactions
      const frictionFactor = Math.pow(friction, delta * 60)
      velocityRef.current *= frictionFactor

      if (Math.abs(velocityRef.current) > 0.001) {
        rotationRef.current += velocityRef.current * delta * 60
      }

      groupRef.current.rotation.y = rotationRef.current

      // Update current index based on rotation
      const anglePerImage = (Math.PI * 2) / images.length
      const currentAngle = -rotationRef.current
      const normalizedAngle = ((currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
      const newIndex = Math.round(normalizedAngle / anglePerImage) % images.length

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
      }
    }
  })

  // Individual image plane component
  const ImagePlane = ({ texture, index, total }: { texture: THREE.Texture; index: number; total: number }) => {
    const meshRef = useRef<THREE.Mesh>(null)
    const angle = (index * Math.PI * 2) / total

    const dynamicRadius = getDynamicRadius()
    const spiralOffset = Math.sin(scrollProgress * Math.PI * 4 + angle) * 0.5 // Sinusoidal spiral effect
    const x = Math.sin(angle) * dynamicRadius
    const z = Math.cos(angle) * dynamicRadius + spiralOffset

    // Calculate opacity based on distance from center
    const getOpacity = () => {
      let distance = Math.abs(index - currentIndex)
      if (distance > total / 2) {
        distance = total - distance
      }

      if (distance === 0) return 1.0 // Center image
      if (distance === 1) return 0.8 // Adjacent images
      return 0.5 // Far images
    }

    // Create material with rounded corners
    const material = useMemo(() => {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uOpacity: { value: 1.0 },
          uCornerRadius: { value: 0.01 },
          uResolution: { value: new THREE.Vector2(imageWidth, imageHeight) },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vUv = uv;
            vPosition = position;
            
            // Add subtle cylindrical bending
            vec3 pos = position;
            float bendAmount = 0.15;
            float normalizedX = pos.x / ${imageWidth * 0.5};
            pos.z += normalizedX * normalizedX * bendAmount;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uOpacity;
          uniform float uCornerRadius;
          uniform vec2 uResolution;
          
          varying vec2 vUv;
          
          float roundedRectSDF(vec2 centerPos, vec2 size, float radius) {
            return length(max(abs(centerPos) - size + radius, 0.0)) - radius;
          }
          
          void main() {
            vec2 center = vUv - 0.5;
            vec2 size = vec2(0.5 - uCornerRadius);
            
            float dist = roundedRectSDF(center, size, uCornerRadius);
            float mask = 1.0 - smoothstep(-0.01, 0.01, dist);
            
            vec4 texColor = texture2D(uTexture, vUv);
            gl_FragColor = vec4(texColor.rgb, texColor.a * mask * uOpacity);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      })

      return mat
    }, [texture])

useFrame(() => {
  if (meshRef.current && groupRef.current) {
    // Get world position of the carousel center (the <group>)
    const target = new THREE.Vector3();
    groupRef.current.getWorldPosition(target);

    // Make the plane look at the carousel center
    meshRef.current.lookAt(target);

    // Update opacity (if needed)
    if (material.uniforms) {
      material.uniforms.uOpacity.value = getOpacity();
    }
  }
});

    return (
      <mesh ref={meshRef} position={[x, 0, z]} material={material}>
        <planeGeometry args={[imageWidth, imageHeight, 32, 32]} />
      </mesh>
    )
  }

  return (
    <group ref={groupRef} position={position}>
      {images.map((image, index) => (
        <ImagePlane key={`${image}-${index}`} texture={textures[index]} index={index} total={images.length} />
      ))}
    </group>
  )
}
