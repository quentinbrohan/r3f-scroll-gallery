import { Image as ImageDrei, useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from "three";
import './utils';

const DEFAULT_BEND_FACTOR = 0.1
const DEFAULT_OPACITY = 0.6

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

    // TODO: handle image + video, hover effect
    const [hovered, hover] = useState(false)
    const pointerOver = (e) => (e.stopPropagation(), hover(true))
    const pointerOut = () => hover(false)

    useFrame((_state, delta) => {
        if (!meshRef.current) return;
        easing.damp(meshRef.current.material, 'opacity', hovered ? 0.8 : DEFAULT_OPACITY, 0.2, delta)
        easing.damp(meshRef.current.material, 'grayscale', hovered ? 0 : 1, 0.2, delta)
    })

    useCursor(hovered)

    return (
        <ImageDrei
            ref={meshRef}
            position={position}
            scale={[1, 1]}
            texture={texture}
            transparent
            side={2}
            radius={0}
            onPointerOver={pointerOver}
            onPointerOut={pointerOut}
        >
            <bentPlaneGeometry args={[DEFAULT_BEND_FACTOR, 1, 1, 20, 20]} />
        </ImageDrei>
    )
}

export default Image;