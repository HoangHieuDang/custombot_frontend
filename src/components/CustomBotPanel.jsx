import { useState, useEffect, Suspense, Fragment } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DynamicPart } from "./DynamicPart";
import Parts from "../api/partsApi";
import Bots from "../api/customBotsApi";

const CustomBotPanel = ({ botId }) => {
  // List of all possible robot part types
  const possibleParts = [
    "skeleton",
    "head",
    "arm",
    "upper_arm",
    "lower_arm",
    "hand",
    "shoulder",
    "chest",
    "upper_waist",
    "lower_waist",
    "side_skirt",
    "front_skirt",
    "back_skirt",
    "upper_leg",
    "lower_leg",
    "knee",
    "foot",
    "backpack",
  ];

  const basePath = "./src/assets/3d_assets/";

  // partUrls stores a list of available models for each part type
  // Example:
  // partUrls = {
  //   head: [{ modelUrl: 'cb_head_1.gltf', partId: 5 }, { modelUrl: 'cb_head_2.gltf', partId: 8 }],
  //   chest: [{ modelUrl: 'cb_chest_1.gltf', partId: 6 }]
  // }
  const [partUrls, setPartUrls] = useState({});

  // currentParts stores the selected part for this bot, including left/right if asymmetric
  // Example:
  // currentParts = {
  //   head: { index: 0, direction: 'center', partId: 2, modelUrl: 'cb_head_1.gltf' },
  //   upper_arm: [
  //     { index: 1, direction: 'left', partId: 1, modelUrl: 'cb_arm_left.gltf' },
  //     { index: 2, direction: 'right', partId: 3, modelUrl: 'cb_arm_right.gltf' }
  //   ]
  // }
  const [currentParts, setCurrentParts] = useState({});

  // First useEffect: Fetch parts for the current custom bot by ID
  useEffect(() => {
    const fetchCurrentBot = async () => {
      const botApi = new Bots();
      const botParts = await botApi.getPartsFromCustomBot(botId);
      if (!Array.isArray(botParts)) return;

      const currentPartsObj = {};
      const partUrlsObj = {};

      for (const part of botParts) {
        const { type, direction, model_path, robot_part_id } = part;

        // Store symmetrical or asymmetrical current part
        if (["left", "right"].includes(direction)) {
          if (!currentPartsObj[type]) currentPartsObj[type] = [];
          currentPartsObj[type].push({
            index: 0,
            direction,
            partId: robot_part_id,
            modelUrl: model_path,
          });
        } else {
          currentPartsObj[type] = {
            index: 0,
            direction,
            partId: robot_part_id,
            modelUrl: model_path,
          };
        }

        // Collect into partUrls for prefetching
        if (!partUrlsObj[type]) partUrlsObj[type] = [];
        const alreadyExists = partUrlsObj[type].some(
          (p) => p.partId === robot_part_id
        );
        if (!alreadyExists) {
          partUrlsObj[type].push({
            modelUrl: model_path,
            partId: robot_part_id,
          });
        }
      }

      setCurrentParts(currentPartsObj);
      setPartUrls(partUrlsObj);
    };

    if (botId) fetchCurrentBot();
  }, [botId]);

  // Second useEffect: Fetch more parts from database for each part type, excluding already used ones
  useEffect(() => {
    const fetchAllParts = async () => {
      const partsApi = new Parts();
      const newPartUrls = {};

      // Collect part IDs already used
      const usedPartIds = Object.values(currentParts).flatMap((entry) =>
        Array.isArray(entry) ? entry.map((p) => p.partId) : [entry.partId]
      );

      for (const type of possibleParts) {
        const res = await partsApi.getPart({
          part_type: type,
          page: 1,
          page_size: 10,
          exclude_ids: usedPartIds,
        });

        if (res?.results?.length) {
          const uniqueParts = res.results.filter(
            (p) =>
              !(partUrls[type] || []).some(
                (existing) => existing.partId === p.id
              )
          );
          if (uniqueParts.length > 0) {
            newPartUrls[type] = uniqueParts.map((p) => ({
              modelUrl: p.model_path,
              partId: p.id,
            }));
          }
        }
      }

      // Merge new parts into partUrls only once
      setPartUrls((prev) => {
        const updated = { ...prev };
        for (const [type, parts] of Object.entries(newPartUrls)) {
          updated[type] = [...(prev[type] || []), ...parts];
        }
        return updated;
      });
    };

    if (Object.keys(currentParts).length > 0) fetchAllParts();
  }, [currentParts]);

  // Function to switch between part options using left/right buttons
  const switchPart = (typeKey, delta, side = null) => {
    const urls = partUrls[typeKey];
    if (!urls?.length) return;

    setCurrentParts((prev) => {
      const updated = { ...prev };

      if (Array.isArray(prev[typeKey])) {
        updated[typeKey] = prev[typeKey].map((entry) => {
          if (entry.direction === side) {
            const newIndex = (entry.index + delta + urls.length) % urls.length;
            const newPart = urls[newIndex];
            return {
              ...entry,
              index: newIndex,
              modelUrl: newPart.modelUrl,
              partId: newPart.partId,
            };
          }
          return entry;
        });
      } else {
        const newIndex =
          (prev[typeKey].index + delta + urls.length) % urls.length;
        const newPart = urls[newIndex];
        updated[typeKey] = {
          ...prev[typeKey],
          index: newIndex,
          modelUrl: newPart.modelUrl,
          partId: newPart.partId,
        };
      }

      return updated;
    });
  };

  return (
    <>
      {/* 3D Canvas */}

      <div className="bg-gray-900 gap-5 flex flex-column text-amber-50 font-extralight m-5 rounded-2xl">
        <button className="rounded-2xl bg-gray-700 p-3 m-2">
          Save customization
        </button>
        <button className="rounded-2xl bg-gray-700 p-3 m-2">Order this bot</button>
      </div>
      <div className="flex gap-6 m-5">
        <div className="w-3/5 h-[700px] border rounded-md overflow-hidden">
          <Canvas
            style={{ backgroundColor: "#BE5B50" }}
            camera={{ position: [0, 0, 15], fov: 100 }}
          >
            <ambientLight intensity={5} />
            <directionalLight position={[1, 2, 5]} intensity={5} />
            <OrbitControls />
            <Suspense fallback={null}>
              {Object.entries(currentParts).map(([type, entry]) => {
                if (Array.isArray(entry)) {
                  return entry.map(({ modelUrl, direction }, idx) => (
                    <DynamicPart
                      key={`${type}_${direction}_${idx}`}
                      url={`${basePath}${modelUrl}`}
                      direction={direction}
                      rotation={[0, Math.PI / 2, 0]}
                    />
                  ));
                } else {
                  return (
                    <DynamicPart
                      key={`${type}`}
                      url={`${basePath}${entry.modelUrl}`}
                      direction={entry.direction}
                      rotation={[0, Math.PI / 2, 0]}
                    />
                  );
                }
              })}
            </Suspense>
          </Canvas>
        </div>

        {/* Customize Option Panel */}
        <div className="w-2/5 h-[700px] overflow-y-auto p-4 border rounded-md bg-gray-800 shadow-inner items-center text-white">
          <h2 className="text-xl font-semibold mb-4">Customize Parts</h2>
          {Object.entries(currentParts).map(([typeKey, partEntry]) => {
            if (typeKey === "skeleton") return null;
            const urls = partUrls[typeKey] || [];

            return (
              <div key={typeKey} className="mb-4">
                <h3 className="text-lg font-medium mb-1 capitalize">
                  {typeKey}
                </h3>

                {Array.isArray(partEntry) ? (
                  partEntry.map(({ direction, index, modelUrl }, i) => (
                    <div
                      key={`${typeKey}_${direction}`}
                      className="flex items-center gap-2 text-sm text-gray-300 mb-1"
                    >
                      <span className="w-14 capitalize">{direction}:</span>
                      <button
                        onClick={() => switchPart(typeKey, -1, direction)}
                      >
                        <img
                          className="h-5"
                          src="./src/assets/ui_components/left-arrow.png"
                        />
                      </button>
                      <span className="flex-1 text-center text-xs truncate">
                        {modelUrl?.replace(".gltf", "") || "N/A"}
                      </span>
                      <button onClick={() => switchPart(typeKey, 1, direction)}>
                        <img
                          className="h-5"
                          src="./src/assets/ui_components/right-arrow.png"
                        />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-14">Option:</span>
                    <button onClick={() => switchPart(typeKey, -1)}>
                      <img
                        className="h-5"
                        src="./src/assets/ui_components/left-arrow.png"
                      />
                    </button>
                    <span className="flex-1 text-center text-xs truncate">
                      {partEntry.modelUrl?.replace(".gltf", "") || "N/A"}
                    </span>
                    <button onClick={() => switchPart(typeKey, 1)}>
                      <img
                        className="h-5"
                        src="./src/assets/ui_components/right-arrow.png"
                      />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CustomBotPanel;
