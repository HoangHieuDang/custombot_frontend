import React, { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

export function DynamicPart({
  url,
  isSymmetrical = false,
  side = "left", // 'left', 'right', or 'center'
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  // Load GLTF once
  const { scene } = useGLTF(url);

  // Clone the scene if needed to avoid React Three Fiber removing other instances
  const clonedScene = useMemo(() => clone(scene), [scene]);

  // Determine scale based on mirroring
  const scale =
    isSymmetrical && side === "right"
      ? [1, 1, -1] // mirror on X-axis
      : [1, 1, 1];

  // Select which object to render
  const objectToRender =
    isSymmetrical && side === "right" ? clonedScene : scene;

  return (
    <Suspense fallback={null}>
      <primitive
        object={objectToRender}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    </Suspense>
  );
}
