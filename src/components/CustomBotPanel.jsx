import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DynamicPart } from "./DynamicPart";

const CustomBotPanel = () => {
  const basePath = "./src/assets/3d_assets/";

  const partUrls = {
    skeleton: ["custombot_skeleton.gltf"],
    head: ["cb_head_1.gltf", "cb_head_2.gltf"],
    chest: ["cb_chest_1.gltf"],
    upper_waist: ["cb_upper_waist_1.gltf"],
    lower_waist: ["cb_lower_waist_1.gltf"],
    shoulder: ["cb_shoulder_1.gltf", "cb_shoulder_2.gltf"],
    upper_arm: ["cb_upper_arm_1.gltf"],
    lower_arm: ["cb_lower_arm_1.gltf"],
    hand: ["cb_hand_1.gltf"],
    side_skirt: ["cb_side_skirt_1.gltf"],
    front_skirt: ["cb_front_skirt_1.gltf"],
    back_skirt: ["cb_back_skirt_1.gltf"],
    upper_leg: ["cb_upper_leg_1.gltf"],
    lower_leg: ["cb_lower_leg_1.gltf"],
    foot: ["cb_foot_1.gltf"],
  };

  const [currentParts, setCurrentParts] = useState(
    Object.keys(partUrls).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  );

  const switchPart = (category, direction) => {
    setCurrentParts((prev) => {
      const urls = partUrls[category];
      const newIndex = (prev[category] + direction + urls.length) % urls.length;
      return { ...prev, [category]: newIndex };
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create your Custom Bot</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          console.log(formData.get("name"));
        }}
        className="mb-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Bot's Name"
          className="w-full px-4 py-2 border rounded-md"
        />
      </form>

      <div className="flex gap-6">
        {/* Left: 3D View */}
        <div className="w-3/5 h-[700px] border rounded-md overflow-hidden">
          <Canvas
            style={{ backgroundColor: "#BE5B50" }}
            camera={{ position: [0, 0, 15], fov: 100 }}
          >
            <ambientLight intensity={5} />
            <directionalLight position={[1, 2, 5]} intensity={10} />
            <OrbitControls />

            {Object.entries(currentParts).map(([category, index]) => {
              const url = `${basePath}${partUrls[category][index]}`;
              const props = {
                url,
                scale: 1,
                rotation: [0, Math.PI / 2, 0],
                position: [0, 0, 0],
              };

              // These parts are symmetrical, so we render a mirrored version
              const symmetricalParts = [
                "shoulder",
                "upper_arm",
                "lower_arm",
                "hand",
                "upper_leg",
                "lower_leg",
                "foot",
              ];

              if (symmetricalParts.includes(category)) {
                return (
                  <group key={category}>
                    {/* Left side (original) */}
                    <DynamicPart {...props} />

                    {/* Right side (mirrored) */}
                    <DynamicPart
                      {...props}
                      scale={[-1, 1, 1]} // flip on X-axis
                    />
                  </group>
                );
              }

              return <DynamicPart key={category} {...props} />;
            })}
          </Canvas>
        </div>

        {/* Right: Part Controls */}
        <div className="w-2/5 h-[700px] overflow-y-auto p-4 border rounded-md bg-gray-800 shadow-inner">
          <h2 className="text-xl font-semibold mb-4">Customize Parts</h2>

          {Object.keys(partUrls).map((category) => (
            <div key={category} className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="capitalize font-medium">{category}</span>
                <span className="text-sm text-gray-500">
                  {currentParts[category] + 1}/{partUrls[category].length}
                </span>
              </div>
              <div className="flex">
                <button
                  className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                  onClick={() => switchPart(category, -1)}
                >
                  ⬅️
                </button>
                <div className="flex-1 text-center py-1 bg-gray-50 border-t border-b">
                  {partUrls[category][currentParts[category]]
                    .replace("cb_", "")
                    .replace(".gltf", "")}
                </div>
                <button
                  className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                  onClick={() => switchPart(category, 1)}
                >
                  ➡️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomBotPanel;
