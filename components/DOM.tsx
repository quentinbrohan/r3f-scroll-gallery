import React from 'react'
import Gallery from './Gallery'

interface DOMProps { }


const DOM: React.FC<DOMProps> = () => {
    return (
        // TODO: need to compute height based on strips
        <main className='relative h-[300vh] w-full bg-black/75'>
            <Gallery />
        </main>
    )
}

export default DOM