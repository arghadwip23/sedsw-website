/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/models/moon2.glb 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Moon(props) {
  const { nodes, materials } = useGLTF('/models/moon2.glb')
  return (
    <group {...props} dispose={null}>
      <mesh 
      geometry={nodes.Sphere_Material002_0.geometry} 
      material={materials['Material.002']} 
     
      rotation={[-Math.PI / 2, 0, 0]}
       scale={2} 
       
  />
    </group>
  )
}

useGLTF.preload('/models/moon2.glb')
