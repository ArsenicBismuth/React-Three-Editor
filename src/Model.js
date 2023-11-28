import React, { useRef, useLayoutEffect } from "react";
import { useGLTF, useFBX, useTexture } from "@react-three/drei";

import * as THREE from 'three'
import * as dat from 'dat.gui';

// Importer
export function ImportGLTF(props) {
  const { scene, materials } = useGLTF('/models/suzanne.gltf')
  useLayoutEffect(() => {
    scene.traverse((obj) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true))
    materials[""].color.set('orange')
    materials[""].roughness = 0
  })
  return (
    <primitive object={scene} {...props} 
      position={[0, -10, 0]}
    />
  )
}

export function ImportFBX(props) {
  const fbx = useFBX("/models/char.fbx")
  const newMat = LoadMaterial()

  Selected = useRef()

  useLayoutEffect(() => {
    swapMaterial(newMat)
    userInterface()
  })

  return (
    <primitive object={fbx}
      {...props}
      position={[0, -10, 0]}
      scale={0.1}
      ref={Selected}>
    </primitive>
  )
}


// Selection
let Selected = null
export function getSelection() {
  return Selected.current
}

function getMaterial() {
  const obj = getSelection()
  if (!obj) return null

  let mat = null
  obj.traverse((o) => {
    if (!o.isMesh) return
    mat = o.material
  })

  return mat
}

// GUI
function handleColorChange( color ) {
  return (value) => {
    if ( typeof value === 'string' ) {
      value = value.replace( '#', '0x' );
    }
    color.setHex(value)
  }
}

function userInterface() {
  const gui = new dat.GUI()

  // Force standard material
  let mat = getMaterial()
  if (mat.type !== "MeshStandardMaterial")
    mat = toStandardMaterial()

  gui.addColor( {"color": mat.color.getHex()}, 'color').onChange( handleColorChange( mat.color ) )
  gui.addColor( {"emissive": mat.emissive.getHex()}, 'emissive').onChange( handleColorChange( mat.emissive ) )
  
  gui.add( mat, 'wireframe' )
  gui.add( mat, 'transparent' ).onChange( () => {mat.needsUpdate = true} )
  gui.add( mat, 'opacity', 0, 1 ).step( 0.01 )
  gui.add( mat, 'roughness', 0, 1 )
  gui.add( mat, 'metalness', 0, 1 )
}


// Asset management
function toStandardMaterial() {
  // Swap from arbitrary material to standard material (more realistic)
  const newMat = new THREE.MeshStandardMaterial()
  swapMaterial(newMat)

  return newMat
}

function swapMaterial(newMat) {
  const obj = getSelection()
  if (!obj) return null
  
  obj.traverse((o) => {
    if (!o.isMesh) return
    newMat.map = o.material.map
    o.material = newMat
  })
}

function LoadMaterial(dir = "/paving/") {
  const baseDir = "./materials" + dir
  const [map, normalMap, roughnessMap, metalnessMap] = useTexture([ 
    baseDir + 'Color.jpg', 
    baseDir + 'NormalGL.jpg', 
    baseDir + 'Roughness.jpg', 
    // baseDir + 'Metalness.jpg',
  ])

  const material = new THREE.MeshStandardMaterial({
    map,
    normalMap,
    roughnessMap,
    metalnessMap
  })

  return material
}