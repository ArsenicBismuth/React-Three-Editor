import React, { useRef, useLayoutEffect } from "react";
import { useGLTF, useFBX } from "@react-three/drei";

import * as dat from 'dat.gui';

// Importer
export function ImportGLTF(props) {
  const { scene, materials } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/suzanne-high-poly/model.gltf')
  useLayoutEffect(() => {
    scene.traverse((obj) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true))
    materials.default.color.set('orange')
    materials.default.roughness = 0
  })
  return (
    <primitive object={scene} {...props} 
      position={[0, -10, 0]}
    />
  )
}

export function ImportFBX(props) {
  const fbx = useFBX("/char.fbx")
  Selected = useRef()

  setTimeout(() => {
    UserInterface()
  }, 2000)

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

function UserInterface() {
  const gui = new dat.GUI()
  const mat = getMaterial()

  gui.addColor( {"color": mat.color.getHex()}, 'color').onChange( handleColorChange( mat.color ) )
  gui.addColor( {"emissive": mat.emissive.getHex()}, 'emissive').onChange( handleColorChange( mat.emissive ) )
  gui.addColor( {"specular": mat.specular.getHex()}, 'specular').onChange( handleColorChange( mat.specular ) )
  
  gui.add( mat, 'wireframe' )
  gui.add( mat, 'transparent' ).onChange( () => {mat.needsUpdate = true} )
  gui.add( mat, 'opacity', 0, 1 ).step( 0.01 )
  gui.add( mat, 'reflectivity', 0, 1 )
  gui.add( mat, 'shininess', 0, 100 )
  gui.add( mat, 'refractionRatio', 0, 1 )
}
