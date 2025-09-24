import React, { useEffect, useRef } from 'react';
import * as THREE from "three"

interface ImageProps {
    position: THREE.Vector3Tuple;
    lookAtY: number;
    texture: THREE.Texture;
}

const Image: React.FC<ImageProps> = ({ position, lookAtY, texture }) => {
    const meshRef = useRef<THREE.Mesh>(null)

    useEffect(() => {
        if (!meshRef.current) return;
        meshRef.current.lookAt(0, lookAtY, 0)
    }, [])

    const fragmentShader = /*glsl*/ `
    uniform sampler2D uTexture;
    varying vec2 vUv;

void main() {
    vec3 image = texture2D(uTexture, vUv).rgb;

   gl_FragColor = vec4(image, 0.6);
}`

    const vertexShader = /*glsl*/ `
    uniform float bendAmount;
    varying vec2 vUv;

void main() {
   vec3 newPosition = position;

   newPosition.z -= sin(uv.x * 3.141) * bendAmount;

   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
   vUv = uv;
}`

// TODO: handle image + video, hover effect
    return (
        <mesh
            ref={meshRef}
            position={position}
            scale={[1.5, 1, 1]}
        >
            <planeGeometry args={[1, 1, 32, 1]} />
            {/* <meshBasicMaterial side={2}
                // wireframe
                map={texture}
                opacity={0.6}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                uniforms={{
                    bendAmount: {
                        value: 0.1
                    }
                }}
            /> */}
            <shaderMaterial side={2}
                // wireframe
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                uniforms={{
                    bendAmount: {
                        value: 0.1
                    },
                    uTexture: {
                        value: texture
                    }
                }}
            />
        </mesh>
    );
}

export default Image;