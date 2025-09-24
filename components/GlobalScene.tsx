import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig'
import { OrbitControls, Stats } from '@react-three/drei'
import React from 'react'

interface GlobalSceneProps { }

const GlobalScene: React.FC<GlobalSceneProps> = () => {
    return (
        <>
            <SmoothScrollbar config={{ lerp: 0.125 }} />
            <GlobalCanvas shadows>
                {/* <OrbitControls /> */}
                <Stats />
            </GlobalCanvas>
        </>
    )
}

export default GlobalScene