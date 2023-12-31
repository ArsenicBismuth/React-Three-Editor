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
    <primitive object={scene} {...props} />
  )
}

export function ImportFBX(props) {
  // Load all assets (including alternative materials)
  const fbx = useFBX("/models/char.fbx")
  LoadMaterial("paving")
  LoadMaterial("rock")
  LoadMaterial("plate")
  // TODO: Load only on-demand, and dispose assets when not in use

  Selected = useRef()
  console.log(Selected)

  useLayoutEffect(() => {
    MatDefault = toStandardMaterial()
    userInterface()
  })

  return (
    <primitive object={fbx}
      {...props}
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

let GUI = null
function userInterface() {
  // Hacky way to prevent multiple GUIs
  if (GUI) GUI.destroy()
  const gui = new dat.GUI()
  GUI = gui

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
  gui.add( mat, 'displacementScale', 0, 1 )
  gui.add( mat, 'aoMapIntensity', 0, 2 )

  // Material swapper
  const keys = ['default', 'paving', 'rock', 'plate']
  gui.add( {"material": MatKey}, 'material', keys ).onChange( menuSwapMaterial )

}


// Asset management
let MatDefault = null
let MatKey = 'default'
const MatLibrary = {}

function toStandardMaterial() {
  // Swap from arbitrary material to standard material (more realistic)
  const newMat = new THREE.MeshStandardMaterial()
  swapMaterial(newMat)

  return newMat
}

function menuSwapMaterial(key) {
  if (MatKey === key) return
  MatKey = key

  if (key === 'default') {
    swapMaterial(MatDefault)
    return
  }

  swapMaterial(MatLibrary[key])
}

function swapMaterial(newMat) {
  const obj = getSelection()
  if (!obj) return null
  
  obj.traverse((o) => {
    if (!o.isMesh) return
    if (newMat.map == null) newMat.map = o.material.map
    o.material = newMat

    userInterface()
  })
}

function LoadMaterial(dir = "paving") {
  const baseDir = "./materials/" + dir + "/"
  const [map, normalMap, roughnessMap, aoMap, displacementMap, metalnessMap] = useTexture([ 
    baseDir + 'Color.jpg', 
    baseDir + 'NormalGL.jpg', 
    baseDir + 'Roughness.jpg',
    baseDir + 'AmbientOcclusion.jpg',
    baseDir + 'Displacement.jpg',
    baseDir + 'Metalness.jpg',
  ])

  const material = new THREE.MeshStandardMaterial({
    map,
    normalMap,
    roughnessMap,
    aoMap,
    displacementMap,
    metalnessMap
  })

  // Store material in library
  MatLibrary[dir] = material

  return material
}