import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig'
import { OrbitControls } from '@react-three/drei'
import React from 'react'

interface GlobalSceneProps { }

const GlobalScene: React.FC<GlobalSceneProps> = () => {
    return (
        <>
            <SmoothScrollbar config={{ lerp: 0.125 }} />
            <GlobalCanvas>
                {/* <OrbitControls /> */}
            </GlobalCanvas>
        </>
    )
}

export default GlobalScene