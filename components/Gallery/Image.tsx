import { MeshDistortMaterial } from '@react-three/drei';
import React, { useEffect, useRef } from 'react';
import * as THREE from "three"

interface ImageProps {
    position: THREE.Vector3Tuple;
    lookAtY: number;
}

const Image: React.FC<ImageProps> = ({ position, lookAtY }) => {
    const meshRef = useRef<THREE.Mesh>(null)

    useEffect(() => {
        if (!meshRef.current) return;
        meshRef.current.lookAt(0, lookAtY, 0)
    }, [])

    const fragmentShader = /*glsl*/ `
void main() {
   gl_FragColor = vec4(1.0, 0.0, 0.0, 0.6);
}`

    const vertexShader = /*glsl*/ `
    uniform float bendAmount;
void main() {
   vec3 newPosition = position;

   newPosition.z -= sin(uv.x * 3.141) * bendAmount;

   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}`

    return (
        <mesh
            ref={meshRef}
            position={position}
            scale={[1.5, 1, 1]}
        >
            <planeGeometry args={[1, 1, 32, 1]} />
            <shaderMaterial side={2}
                // wireframe
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                uniforms={{
                    bendAmount: {
                        value: 0.1
                    }
                }}
            />
        </mesh>
    );
}

export default Image;