import './App.css';

import React, { Suspense, useRef } from 'react'

import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

import { ImportGLTF, ImportFBX, getSelection } from './Model'

function Scene({orbitRef}) {
  return (
    <>
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <ImportFBX />
      <ImportGLTF />
      <Environment preset="city" />
    </>
  )
}

function App() {
  const orbitRef = useRef()
  THREE.ColorManagement.enabled = true

  return (
    <div id="canvas-container">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 12, 18], fov: 60 }}>
        <Suspense fallback={null}>
          <Scene orbitRef={orbitRef} />
        </Suspense>
        <OrbitControls ref={orbitRef} />
      </Canvas>
    </div>
  )
}

export default App;
