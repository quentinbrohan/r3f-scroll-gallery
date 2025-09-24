import { UseCanvas } from '@14islands/r3f-scroll-rig';
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups';
import React, { Suspense, useRef } from 'react';
import { Logo } from '../Logo';
import { CameraRig } from './CameraRig';
import Strips from './Strips';

interface GalleryProps {

}

const Gallery: React.FC<GalleryProps> = ({ }) => {
    const track = useRef(null)

    return (
        <>
            <div ref={track} className='sticky top-0 left-0 h-screen w-full' />
            <UseCanvas>
                <StickyScrollScene track={track}>
                    {() => (
                        <Suspense>
                            <Logo />
                            <Strips />
                            <CameraRig />
                        </Suspense>
                    )}
                </StickyScrollScene>
            </UseCanvas>
        </>
    )
}

export default Gallery;