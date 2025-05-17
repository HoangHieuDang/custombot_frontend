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
          style={{ backgroundColor: "#BE5B50" }}
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
            url={"./src/assets/3d_assets/cb_chest_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Upper Waist */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_upper_waist_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Lower Waist */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_lower_waist_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Shoulder */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_shoulder_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Upper_arm */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_upper_arm_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Lower_arm */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_lower_arm_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Hand */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_hand_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Side_skirt */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_side_skirt_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Front_skirt */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_front_skirt_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Back_skirt */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_back_skirt_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Upper_leg */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_upper_leg_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Lower_leg */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_lower_leg_1.gltf"}
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Foot */}
          <DynamicPart
            url={"./src/assets/3d_assets/cb_foot_1.gltf"}
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
