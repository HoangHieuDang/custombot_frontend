import React from "react";
import { DynamicPart } from "./DynamicPart";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const CustomBot = () => {
  return (
    <>
      <h1>Create your Custom Bot</h1>
      <div className="h-3/4 w-1/2">
        <Canvas
          style={{ backgroundColor: "#EFDCAB" }}
          camera={{ position: [0, 0, 15], rotation: [0, 0, 0], fov: 100 }}
        >
          <ambientLight intensity={5} />
          <directionalLight position={[1, 2, 5]} intensity={10} />
          <OrbitControls />

          {/* Skeleton */}
          <DynamicPart
            url={"./src/assets/3d_assets/custombot_skeleton.gltf"}
            scale={1}
            rotation={[0, Math.PI / 2, 0]}
          />
          {/* Head */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_head_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Chest */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_head_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Waist */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_head_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Upper_arm */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_head_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Lower_arm */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_head_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Hand */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_head_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Side_skirt */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_head_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Front_skirt */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_head_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Upper_leg */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_head_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Lower_leg */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_head_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Foot */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_head_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />
        </Canvas>
      </div>
    </>
  );
};

export default CustomBot;
