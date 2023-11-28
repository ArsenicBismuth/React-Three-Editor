import './App.css';

import React, { Suspense, useRef } from 'react'

import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

import { ImportGLTF, ImportFBX, getSelection } from './Model'

function Scene() {
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
  THREE.ColorManagement.enabled = true

  return (
    <div id="canvas-container">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 12, 18], fov: 60 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <OrbitControls target={[0, 10, 0]} />
      </Canvas>
    </div>
  )
}

export default App;
