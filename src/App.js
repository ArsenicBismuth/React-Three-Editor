import './App.css';

import React, { Suspense, useRef } from 'react'
import { createRoot } from 'react-dom/client'

import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'

import { ImportGLTF, ImportFBX } from './Model'

THREE.ColorManagement.enabled = true

function Scene() {
  const ref = useRef()
  return (
    <Stage controls={ref} preset="rembrandt" intensity={1}  environment="city">
    false
      <ImportGLTF />
      <ImportFBX />
    false
    </Stage>
  )
}

function App() {
  const ref = useRef()
  return (
    <div id="canvas-container">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        <Suspense fallback={null}>
          <Scene/>
        </Suspense>
        <OrbitControls ref={ref} />
      </Canvas>
    </div>
  )
}

export default App;
