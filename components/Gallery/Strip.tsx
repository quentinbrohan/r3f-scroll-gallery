import React, { useMemo } from 'react';
import * as THREE from 'three'
import Image from './Image';

interface StripProps {
    numPlanes?: number;
    radius?: number
    y: number;
}

const Strip: React.FC<StripProps> = ({
    numPlanes = 6,
    radius = 2.5,
    y,
}) => {
    const meshes = useMemo(() => {
        const elements = []

        for (let i = 0; i < numPlanes; i++) {
            const angle = (Math.PI * 2) * (i / numPlanes)

            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;

            elements.push(
                <Image
                key={i}
                position={[x, 0, z]}
                lookAtY={y}
                />
            )
        }

        return elements;

    }, [numPlanes, radius])

    return (
        <group scale={120} position-y={y}>
            {meshes}
        </group>
    );
}

export default Strip;