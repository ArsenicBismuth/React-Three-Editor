import './App.css';

import React, { Suspense, useRef } from 'react'

import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'

import { ImportGLTF, ImportFBX, getSelection } from './Model'

function Scene({orbitRef}) {
  return (
    <Stage controls={orbitRef} preset="rembrandt" intensity={1}  environment="forest">
    false
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <ImportFBX />
    false
    </Stage>
  )
}

function App() {
  const orbitRef = useRef()
  THREE.ColorManagement.enabled = true

  return (
    <div id="canvas-container">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        <Suspense fallback={null}>
          <Scene orbitRef={orbitRef} />
        </Suspense>
        <OrbitControls ref={orbitRef} />
      </Canvas>
    </div>
  )
}

export default App;
