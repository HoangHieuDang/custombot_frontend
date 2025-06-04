import React, { Suspense, useMemo } from "react";
import { useGLTF, Text } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

export function DynamicPart({
  url,
  isSymmetrical = false,
  side = "left", // 'left', 'right', or 'center'
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  // Early fallback: if URL is invalid or missing, show 3D error text
  if (!url || typeof url !== "string" || url.trim() === "") {
    return (
      <Text
        position={position}
        rotation={rotation}
        fontSize={0.5}
        color="red"
        anchorX="center"
        anchorY="middle"
      >
        ⚠️ Model not found, url is invalid or undefined
      </Text>
    );
  }

  try {
    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => clone(scene), [scene]);
    const scale = isSymmetrical && side === "right" ? [1, 1, -1] : [1, 1, 1];
    const objectToRender =
      isSymmetrical && side === "right" ? clonedScene : scene;

    return (
      <Suspense fallback={<p>Loading part...</p>}>
        <primitive
          object={objectToRender}
          position={position}
          rotation={rotation}
          scale={scale}
        />
      </Suspense>
    );
  } catch (error) {
    return (
      <Text
        position={position}
        rotation={rotation}
        fontSize={0.5}
        color="red"
        anchorX="center"
        anchorY="middle"
      >
        ⚠️ Model not found: {error}
      </Text>
    );
  }
}
