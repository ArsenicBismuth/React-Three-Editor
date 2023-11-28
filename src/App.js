import './App.css';

import React, { Suspense, useRef } from 'react'
import { createRoot } from 'react-dom/client'

import * as dat from 'dat.gui';

import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'

import { ImportGLTF, ImportFBX, Models } from './Model'

THREE.ColorManagement.enabled = true

function Scene() {
  const ref = useRef()
  return (
    <Stage controls={ref} preset="rembrandt" intensity={0}  environment="city">
    false
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <ImportFBX />
    false
    </Stage>
  )
}

function ColorGUI() {
  const gui = new dat.GUI()
  gui.addColor({ color: '#000000' }, 'color')
    .listen()
    .onChange((e) => {
      Models[0].traverse((o) => {
        if (o.isMesh) o.material.color.setStyle(e);
      })
    })
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
        <ColorGUI />
      </Canvas>
    </div>
  )
}

export default App;
