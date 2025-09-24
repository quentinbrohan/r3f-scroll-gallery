import { ScrollScene, UseCanvas } from '@14islands/r3f-scroll-rig';
import React, { Suspense, useRef } from 'react';
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups';
import { Logo } from '../Logo';
import Strip from './Strip';
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
                            {/* <Strip /> */}
                            <Strips />
                        </Suspense>
                    )}
                </StickyScrollScene>
            </UseCanvas>
        </>
    )
}

export default Gallery;