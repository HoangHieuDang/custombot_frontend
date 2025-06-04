import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, Fragment } from "react";
import { DynamicPart } from "./DynamicPart"; // Updated DynamicPart with lazy loading and error handling
import Parts from "../api/partsApi";

const CustomBotPanel = () => {
  const basePath = "./src/assets/3d_assets/";
  const partUrlsInit = {
    skeleton: [],
    head: [],
    chest: [],
    upper_waist: [],
    lower_waist: [],
    side_skirt: [],
    front_skirt: [],
    back_skirt: [],
    shoulder: [],
    upper_arm: [],
    lower_arm: [],
    hand: [],
    upper_leg: [],
    lower_leg: [],
    foot: [],
  };

  const [partUrls, setPartUrls] = useState(partUrlsInit);
  /* hardcoded example for partUrls
  const partUrls = {
    skeleton: ["custombot_skeleton.gltf"],
    head: ["cb_head_1.gltf", "cb_head_2.gltf"],
    chest: ["cb_chest_1.gltf", "cb_chest_2.gltf"],
    upper_waist: ["cb_upper_waist_1.gltf", "cb_upper_waist_2.gltf"],
    lower_waist: ["cb_lower_waist_1.gltf", "cb_lower_waist_2.gltf"],
    side_skirt: ["cb_side_skirt_1.gltf", "cb_side_skirt_2.gltf"],
    front_skirt: ["cb_front_skirt_1.gltf", "cb_front_skirt_2.gltf"],
    back_skirt: ["cb_back_skirt_1.gltf", "cb_back_skirt_2.gltf"],
    shoulder: ["cb_shoulder_1.gltf", "cb_shoulder_2.gltf"],
    upper_arm: ["cb_upper_arm_1.gltf", "cb_upper_arm_2.gltf"],
    lower_arm: ["cb_lower_arm_1.gltf", "cb_lower_arm_2.gltf"],
    hand: ["cb_hand_1.gltf", "cb_hand_2.gltf"],
    upper_leg: ["cb_upper_leg_1.gltf", "cb_upper_leg_2.gltf"],
    lower_leg: ["cb_lower_leg_1.gltf", "cb_lower_leg_2.gltf"],
    foot: ["cb_foot_1.gltf", "cb_foot_2.gltf"],
  };
  */

  // Fetch parts from API
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const partApi = new Parts();
        const partslistObj = {};

        for (const [partName] of Object.entries(partUrls)) {
          const parts = await partApi.getPart({ part_type: partName });

          if (Array.isArray(parts)) {
            console.log(`${partName}:`, parts);
            partslistObj[partName] = parts
              .map((part) => part.model_path)
              .filter(Boolean); // remove undefined/null
          }
        }

        console.log("Fetched all parts:", partslistObj);
        setPartUrls((prev) => ({ ...prev, ...partslistObj }));
      } catch (error) {
        console.warn("Fetch 3D models failed:", error);
      }
    };

    fetchParts();
  }, []);

  const symmetricalParts = [
    "shoulder",
    "upper_arm",
    "lower_arm",
    "hand",
    "upper_leg",
    "lower_leg",
    "front_skirt",
    "side_skirt",
    "foot",
  ];

  //Define state to track currently selected Part based on Index of each array for each body part in partsUrl
  //Symmetrical part key will have the value of Array which consists of [left_index, right_index]
  //Skeleton should not be changed, since it is universally used

  /*
  Example:
  currentParts{
  arm: [0, 0],              // symmetrical
  leg: [1, 1],              // symmetrical
  backpack: 2,              // asymmetrical
  chest: 0,
  skeleton: 0              // static
  }*/

  const [currentParts, setCurrentParts] = useState(() => {
    const initialParts = {};
    for (const [part, urls] of Object.entries(partUrls)) {
      if (symmetricalParts.includes(part)) {
        initialParts[part] = [0, 0]; // [leftIndex, rightIndex]
        //skeleton should a static model and should not be changed
      } else {
        initialParts[part] = 0;
      }
    }
    return initialParts;
  });

  //This function will trigger Parts switch
  function switchPart(part, direction, side = null) {
    setCurrentParts((prev) => {
      const updated = { ...prev };
      const urls = partUrls[part];
      // check if part belongs to symmetrical parts group
      const isSymmetrical = symmetricalParts.includes(part);
      // check if part is symmetrical and the value is an array like this: [left_index, right_index]
      if (isSymmetrical && Array.isArray(prev[part])) {
        const newIndices = [...prev[part]];
        const sideIndex = side === "left" ? 0 : 1;

        newIndices[sideIndex] =
          (newIndices[sideIndex] + direction + urls.length) % urls.length;

        updated[part] = newIndices;
      } else if (!isSymmetrical && typeof prev[part] === "number") {
        updated[part] = (prev[part] + direction + urls.length) % urls.length;
      } else {
        console.warn(
          `Part "${part}" has unexpected structure or symmetry mismatch.`
        );
      }

      return updated;
    });
  }

  return (
    /* Form to enter name for custombot */
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

      <div className="flex flex-row bg-amber-600">
        <button className="border border-1 rounded-xl p-1 border-amber-100 bg-gray-800 text-white font-extralight">Save current bot</button>
        <button className="border border-1 rounded-xl p-1 border-amber-100 bg-gray-800 text-white font-extralight">Order</button>
      </div>

      {/* 3D Canvas */}
      <div className="flex gap-6">
        <div className="w-3/5 h-[700px] border rounded-md overflow-hidden">
          <Canvas
            style={{ backgroundColor: "#BE5B50" }}
            camera={{ position: [0, 0, 15], fov: 100 }}
          >
            <ambientLight intensity={5} />
            <directionalLight position={[1, 2, 5]} intensity={5} />
            <OrbitControls />
            <Suspense fallback={null}>
              {Object.entries(currentParts).map(([part, index]) => {
                //skipping rendering if the body part key is empty or undefined
                //or when index for left and right counter parts (symmetrical parts) is undefined or empty
                if (
                  index === undefined ||
                  partUrls[part] === undefined ||
                  (Array.isArray(index) &&
                    (!partUrls[part][index[0]] || !partUrls[part][index[1]])) ||
                  (!Array.isArray(index) && !partUrls[part][index])
                ) {
                  console.warn(
                    `Skipping ${part} due to missing model_path or invalid index`,
                    {
                      part,
                      index,
                      urls: partUrls[part],
                    }
                  );
                  return null;
                }
                if (Array.isArray(index) && index) {
                  const [leftIndex, rightIndex] = index;
                  return (
                    <Fragment key={part}>
                      <DynamicPart
                        key={`${part}_left`}
                        url={`${basePath}${partUrls[part][leftIndex]}`}
                        isSymmetrical={true}
                        side="left"
                        rotation={[0, Math.PI / 2, 0]}
                        position={[0, 0, 0]}
                      />
                      <DynamicPart
                        key={`${part}_right`}
                        url={`${basePath}${partUrls[part][rightIndex]}`}
                        isSymmetrical={true}
                        side="right"
                        rotation={[0, Math.PI / 2, 0]}
                        position={[0, 0, 0]}
                      />
                    </Fragment>
                  );
                } else {
                  return (
                    <DynamicPart
                      key={part}
                      url={`${basePath}${partUrls[part][index]}`}
                      isSymmetrical={false}
                      side="center"
                      rotation={[0, Math.PI / 2, 0]}
                      position={[0, 0, 0]}
                    />
                  );
                }
              })}
            </Suspense>
          </Canvas>
        </div>
        {/* Customize Option Panel */}
        <div className="w-2/5 h-[700px] overflow-y-auto p-4 border rounded-md bg-gray-800 shadow-inner items-center">
          <h2 className="text-xl font-semibold mb-4">Customize Parts</h2>
          {/* Dont have to customize skeleton part because it should be a static part */}
          {Object.entries(currentParts).map(([part, index]) => {
            if (part === "skeleton") return null;
            if (Array.isArray(index)) {
              // Symmetrical
              return (
                <div key={part} className="mb-4">
                  <h3 className="text-lg font-medium text-white mb-1">
                    {part}
                  </h3>
                  {/*Left side*/}
                  <div className="flex items-center gap-2 text-sm text-gray-300 mt-2 mb-2">
                    <span className="w-14">Left:</span>
                    <button onClick={() => switchPart(part, -1, "left")}>
                      <img
                        className="h-5"
                        src="./src/assets/ui_components/left-arrow.png"
                      />
                    </button>
                    <span className="flex-1 text-center text-xs text-white truncate">
                      {partUrls[part][index[0]]?.replace(".gltf","") || "N/A"}
                    </span>
                    <button onClick={() => switchPart(part, 1, "left")}>
                      <img
                        className="h-5"
                        src="./src/assets/ui_components/right-arrow.png"
                      />
                    </button>
                  </div>
                  {/*Right side*/}
                  <div className="flex items-center gap-2 text-sm text-gray-300 mt-2 mb-2">
                    <span className="w-14">Right:</span>
                    <button onClick={() => switchPart(part, -1, "right")}>
                      <img
                        className="h-5"
                        src="./src/assets/ui_components/left-arrow.png"
                      />
                    </button>
                    <span className="flex-1 text-center text-xs text-white truncate">
                      {partUrls[part][index[1]]?.replace(".gltf","") || "N/A"}
                    </span>
                    <button onClick={() => switchPart(part, 1, "right")}>
                      <img
                        className="h-5"
                        src="./src/assets/ui_components/right-arrow.png"
                      />
                    </button>
                  </div>
                </div>
              );
            } else {
              // Asymmetrical
              return (
                <div key={part} className="mb-4">
                  <h3 className="text-lg font-medium text-white mb-1">
                    {part}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-14">Option:</span>
                    <button onClick={() => switchPart(part, -1)}>
                      <img
                        className="h-5"
                        src="./src/assets/ui_components/left-arrow.png"
                      />
                    </button>
                    <span className="flex-1 text-center text-xs text-white truncate">
                      {partUrls[part][index]?.replace(".gltf", "") || "N/A"}
                    </span>
                    <button onClick={() => switchPart(part, 1)}>
                      <img
                        className="h-5"
                        src="./src/assets/ui_components/right-arrow.png"
                      />
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomBotPanel;
