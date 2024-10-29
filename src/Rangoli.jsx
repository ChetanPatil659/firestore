import React from 'react'
import ganpati from './assets/rangoli.png'

function Rangoli() {
    return (
        <div style={{ height: '70%', aspectRatio: '16/9', background: 'red', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '5px' }}>
            {Array.from({ length: 15 }).map((_, index) => (
                <div key={index} style={{ background: 'white', border: '1px solid black' }}>
                    {/* Content for each box */}
                </div>
            ))}
        </div>

    )
}

export default Rangoli