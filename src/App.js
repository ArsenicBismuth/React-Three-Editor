
import React, { Suspense, useRef } from 'react'
import { createRoot } from 'react-dom/client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'

import { Model } from './Model'

function App() {
  const ref = useRef()
  return (
    <div id="canvas-container">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        <Suspense fallback={null}>
          <Stage controls={ref} preset="rembrandt" intensity={1}  environment="city">
          false
            <Model />
          false
          </Stage>
        </Suspense>
        <OrbitControls ref={ref} />
      </Canvas>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)

export default App;
