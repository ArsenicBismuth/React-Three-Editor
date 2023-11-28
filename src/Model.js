import React, { useRef } from "react";
import { useGLTF, useFBX } from "@react-three/drei";

export function ImportGLTF(props) {
  const { nodes, materials } = useGLTF("/suzanne.gltf")
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Suzanne.geometry}
        material={nodes.Suzanne.material}
        position={[0, 0.2, 0]}
      />
    </group>
  );
}

export function ImportFBX(props) {
  const fbx = useFBX("/char.fbx")
  Selected = useRef()

  return (
    <primitive object={fbx}
      {...props}
      scale={0.01}
      ref={Selected}
    />
  )
}

let Selected = null
export function getSelection() {
  return Selected.current
};
