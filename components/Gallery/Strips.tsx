import React, { useEffect, useMemo, useRef } from 'react';
import Strip from './Strip';
import * as THREE from 'three';
import { useScrollbar } from '@14islands/r3f-scroll-rig';

interface StripsProps {
    numStrips?: number;
}

const Strips: React.FC<StripsProps> = ({ numStrips = 10 }) => {
    const globalLenis = useScrollbar();

    const groupRef = useRef<THREE.Group>(null)

    const stripsArray = useMemo(() => {
        const elements = [];

        for (let i = 0; i < numStrips; i++) {
            const y = (i - numStrips + 2) * 200

            elements.push(<Strip
                key={i}
                y={y}
            />)
        }

        return elements;
    }, [])

    useEffect(() => {
        if (globalLenis?.__lenis) {
            globalLenis.__lenis.on('scroll', ({ progress, velocity }) => {
                if (!groupRef.current) return;
                // const scaleFactor = 0.05;
                // const scaleFactor = 0.005;
                const scaleFactor = 0.002;
                const scale = (velocity * scaleFactor) + 1;

                groupRef.current.scale.set(scale, scale, scale)
                groupRef.current.rotation.y = progress * (Math.PI * 2)
                groupRef.current.position.y = progress * 200 * (numStrips - 3)
            })
        }

    }, [globalLenis])


    return (
        <group
            ref={groupRef}
        >
            {stripsArray}
        </group>
    );
}

export default Strips;