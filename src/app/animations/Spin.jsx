import React from 'react'
import 'tailwindcss/tailwind.css'

// Define your custom animation within a <style> tag or a CSS file
const customStyles = `
@keyframes spin {
  from {
    transform: rotate(0deg) translate3D(-100px, -80px, 0);
  }
  to {
    transform: rotate(360deg) translate3D(-100px, -80px, 0);
  }
}

.spin-animation {
  animation: spin 2s linear infinite;
}
`

const Spin = () => {
  return (
    <>
      <style>{customStyles}</style>
      <svg
        className='w-52 h-52 mx-auto spin-animation' // Tailwind classes for width, height, and centering
        viewBox='0 0 200 200'
        xmlns='http://www.w3.org/2000/svg'
        version='1.1'>
        {/* SVG content */}
        <circle cx='100' cy='80' r='20' fill='pink' />
        <line x1='100' y1='100' x2='100' y2='150' stroke='pink' strokeWidth='4' />
        <line x1='100' y1='150' x2='120' y2='160' stroke='pink' strokeWidth='4' />
        <line x1='100' y1='150' x2='80' y2='160' stroke='pink' strokeWidth='4' />
        <line x1='100' y1='70' x2='80' y2='90' stroke='pink' strokeWidth='4' />
        <line x1='100' y1='70' x2='120' y2='90' stroke='pink' strokeWidth='4' />
      </svg>
    </>
  )
}

export default Spin
