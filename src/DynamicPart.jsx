import React, {Suspense} from 'react'
import { useGLTF } from '@react-three/drei'

export function DynamicPart({ url, position = [0, 0, 0], scale = 1, rotation=[0,0,0] }) {
  const { scene } = useGLTF(url);
  return (
    <Suspense fallback={null}>
      <primitive object={scene} position={position} scale={scale} rotation={rotation} />
    </Suspense>
  );
}