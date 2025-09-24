import React, { useMemo } from 'react';
import * as THREE from 'three'
import Image from './Image';

interface StripProps {
    numPlanes?: number;
    radius?: number
}

const Strip: React.FC<StripProps> = ({
    numPlanes = 6,
    radius = 2.5
}) => {
    const meshes = useMemo(() => {
        const elements = []

        for (let i = 0; i < numPlanes; i++) {
            const angle = (Math.PI * 2) * (i / numPlanes)

            const x = Math.sin(angle) * radius;
            const y = 0;
            const z = Math.cos(angle) * radius;

            elements.push(
                <Image position={[x, y, z]} key={i} />
            )
        }

        return elements;

    }, [numPlanes, radius])

    return (
        <group scale={150}>
            {meshes}
        </group>
    );
}

export default Strip;