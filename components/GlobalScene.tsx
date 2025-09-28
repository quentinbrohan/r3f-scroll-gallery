import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig'
import { OrbitControls, Stats } from '@react-three/drei'
import React from 'react'

interface GlobalSceneProps { }

const GlobalScene: React.FC<GlobalSceneProps> = () => {
    return (
        <>
            <SmoothScrollbar config={{ lerp: 0.125 }} />
            <GlobalCanvas shadows>
                <ambientLight intensity={0.15} />
                <directionalLight
                    position={[-3, 3, 5]}
                    intensity={0.8}
                    color="white"
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-bias={-0.0001}
                />
                <spotLight
                    position={[0, 4, 4]}
                    angle={0.4}
                    penumbra={0.9}
                    intensity={0.6}
                    distance={12}
                    color="white"
                    castShadow
                />
                {/* <OrbitControls /> */}
                <Stats />
            </GlobalCanvas>
        </>
    )
}

export default GlobalScene