import React, { useEffect, useMemo, useRef } from 'react';
import Strip, { DEFAULT_ITEMS_PER_STRIP } from './Strip';
import * as THREE from 'three';
import { useScrollbar } from '@14islands/r3f-scroll-rig';
import { useTexture } from '@react-three/drei';
import { sampleImages } from '../Experience';

interface StripsProps {
    stripCount?: number;
    stripItemsCount?: number;
}

const Strips: React.FC<StripsProps> = ({ stripCount = 1, stripItemsCount = DEFAULT_ITEMS_PER_STRIP }) => {
    const globalLenis = useScrollbar();

    const groupRef = useRef<THREE.Group>(null)

    const textures = useTexture(sampleImages.flat())
    const itemsToStripsRatio = textures.length / stripItemsCount;
    const maxStrips = Number.isInteger(itemsToStripsRatio) ? itemsToStripsRatio : Math.round(itemsToStripsRatio)

    const texturesByStrips = useMemo(() => {
        const texturesInStrips: THREE.Texture[][] = [];

        for (let i = 0; i < textures.length; i += stripItemsCount) {
            const stripTextures = textures.slice(i, i + stripItemsCount);
            texturesInStrips.push(stripTextures);
        }

        return texturesInStrips;
    }, [textures, stripItemsCount]);

    const stripsArray = useMemo(() => {
        const elements = [];
        if (texturesByStrips.flat().length === 0) return elements;

        for (let i = 0; i < maxStrips; i++) {
            const y = (i - maxStrips + 2) * 200

            elements.push(<Strip
                key={i}
                y={y}
                textures={texturesByStrips[i] ?? []}
                itemsCount={stripItemsCount}
            />)
        }

        return elements;
    }, [texturesByStrips, maxStrips, stripItemsCount])

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
                groupRef.current.position.y = progress * 200 * (maxStrips - 3)
            })
        }

    }, [globalLenis, maxStrips])


    return (
        <group
            ref={groupRef}
        >
            {stripsArray}
        </group>
    );
}

export default Strips;