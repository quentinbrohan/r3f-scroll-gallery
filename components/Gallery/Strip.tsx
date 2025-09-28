import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three'
import Image from './Image';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';

export const DEFAULT_ITEMS_PER_STRIP = 6;
export const DEFAULT_RADIUS = 2.5;

interface StripProps {
    itemsCount?: number;
    radius?: number
    y: number;
    textures: THREE.Texture[]
}

const Strip: React.FC<StripProps> = ({
    itemsCount = DEFAULT_ITEMS_PER_STRIP,
    radius = DEFAULT_RADIUS,
    y,
    textures,
}) => {
    const groupRef = useRef<THREE.Group>(null);

    const meshes = useMemo(() => {
        const elements = []

        for (let i = 0; i < itemsCount; i++) {
            const angle = (Math.PI * 2) * (i / itemsCount)

            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;

            elements.push(
                <Image
                    key={i}
                    position={[x, 0, z]}
                    lookAtY={y}
                    texture={textures[i]}
                />
            )
        }

        return elements;

    }, [itemsCount, radius, textures, y])

    const direction = gsap.utils.random(-0.25, 0.25)


    useEffect(() => {
        if (!groupRef.current) return;
        const random = gsap.utils.random(110, 130)

        groupRef.current.scale.set(random, random, random)
    }, [])

    useFrame(({ clock }) => {
        if (!groupRef.current) return;

        const time = clock.elapsedTime;

        groupRef.current.rotation.y = time * direction;

    })

    return (
        <group
            ref={groupRef}
            scale={120} position-y={y}>
            {meshes}
        </group>
    );
}

export default Strip;