import { useState, useEffect, Suspense, Fragment } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DynamicPart } from "./DynamicPart";
import Parts from "../api/partsApi";
import Bots from "../api/customBotsApi";

const CustomBotPanel = ({ botId }) => {
  const basePath = "./src/assets/3d_assets/";

  const possibleParts = [
    "skeleton", "head", "arm", "upper_arm", "lower_arm", "hand",
    "shoulder", "chest", "upper_waist", "lower_waist",
    "side_skirt", "front_skirt", "back_skirt",
    "upper_leg", "lower_leg", "knee", "foot", "backpack"
  ];

  const [partUrls, setPartUrls] = useState({});
  const [currentParts, setCurrentParts] = useState({});
  const [usedPartIds, setUsedPartIds] = useState([]);

  useEffect(() => {
    const fetchBotParts = async () => {
      const botApi = new Bots();
      const botParts = await botApi.getPartsFromCustomBot(botId);

      const formattedPartUrls = {};
      const initialIndices = {};
      const usedIds = [];

      botParts.forEach((part) => {
        const key = `${part.type}_${part.direction}`;
        if (!formattedPartUrls[key]) formattedPartUrls[key] = [];
        if (!formattedPartUrls[key].includes(part.model_path)) {
          formattedPartUrls[key].push(part.model_path);
        }
        const index = formattedPartUrls[key].indexOf(part.model_path);
        initialIndices[key] = index;
        usedIds.push(part.robot_part_id);
      });

      setPartUrls(formattedPartUrls);
      setCurrentParts(initialIndices);
      setUsedPartIds(usedIds);
    };

    if (botId) fetchBotParts();
  }, [botId]);

  useEffect(() => {
    const fetchAvailableParts = async () => {
      const partsApi = new Parts();
      for (const type of possibleParts) {
        for (const direction of ["left", "right", "center"]) {
          const key = `${type}_${direction}`;
          try {
            const available = await partsApi.getPart({
              part_type: type,
              direction,
              page: 1,
              page_size: 10,
              exclude_ids: usedPartIds,
            });

            if (available?.results?.length > 0) {
              setPartUrls((prev) => ({
                ...prev,
                [key]: [
                  ...(prev[key] || []),
                  ...available.results.map((p) => p.model_path),
                ],
              }));
            }
          } catch (err) {
            console.warn(`Failed to fetch parts for ${key}:`, err);
          }
        }
      }
    };

    if (usedPartIds.length > 0) fetchAvailableParts();
  }, [usedPartIds]);

  const switchPart = (partKey, directionDelta) => {
    setCurrentParts((prev) => {
      const updated = { ...prev };
      const urls = partUrls[partKey];
      if (!urls) return prev;

      updated[partKey] = (updated[partKey] + directionDelta + urls.length) % urls.length;

      const [type, direction] = partKey.split("_");
      const newModelPath = urls[updated[partKey]];

      const botsApi = new Bots();
      botsApi.getPart({ model_path: newModelPath }).then((result) => {
        const part = result?.results?.[0];
        if (part) {
          botsApi.updatePartOnCustomBot({
            bot_id: botId,
            part_id: part.id,
            direction,
            amount: 1,
          });
        }
      });

      return updated;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-extralight p-3">Create your Custom Bot</h1>
      <p>Selected Bot: {botId}</p>

      <form onSubmit={(e) => e.preventDefault()} className="mb-6">
        <input
          type="text"
          name="name"
          placeholder="Bot's Name"
          className="w-full px-4 py-2 border rounded-md"
        />
      </form>

      <div className="flex flex-row bg-amber-600 mb-4">
        <button className="border border-1 rounded-xl p-1 border-amber-100 bg-gray-800 text-white font-extralight">
          Save current bot
        </button>
        <button className="border border-1 rounded-xl p-1 border-amber-100 bg-gray-800 text-white font-extralight">
          Order
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-3/5 h-[700px] border rounded-md overflow-hidden">
          <Canvas style={{ backgroundColor: "#BE5B50" }} camera={{ position: [0, 0, 15], fov: 100 }}>
            <ambientLight intensity={5} />
            <directionalLight position={[1, 2, 5]} intensity={5} />
            <OrbitControls />
            <Suspense fallback={null}>
              {Object.entries(currentParts).map(([partKey, index]) => {
                const urls = partUrls[partKey];
                if (!urls || !urls[index]) return null;
                const [type, direction] = partKey.split("_");

                return (
                  <DynamicPart
                    key={partKey}
                    url={`${basePath}${urls[index]}`}
                    isSymmetrical={direction !== "center"}
                    side={direction}
                    rotation={[0, Math.PI / 2, 0]}
                    position={[0, 0, 0]}
                  />
                );
              })}
            </Suspense>
          </Canvas>
        </div>

        <div className="w-2/5 h-[700px] overflow-y-auto p-4 border rounded-md bg-gray-800 shadow-inner">
          <h2 className="text-xl font-semibold mb-4">Customize Parts</h2>
          {Object.entries(currentParts).map(([partKey, index]) => {
            if (partKey.startsWith("skeleton")) return null;
            const urls = partUrls[partKey];
            const label = partKey.includes("_left") ? "Left" : partKey.includes("_right") ? "Right" : "Option";

            return (
              <div key={partKey} className="mb-4">
                <h3 className="text-lg font-medium text-white mb-1">{partKey.replace("_", " ")}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-14">{label}:</span>
                  <button onClick={() => switchPart(partKey, -1)}>
                    <img className="h-5" src="./src/assets/ui_components/left-arrow.png" />
                  </button>
                  <span className="flex-1 text-center text-xs text-white truncate">
                    {urls && urls[index]?.replace(".gltf", "") || "N/A"}
                  </span>
                  <button onClick={() => switchPart(partKey, 1)}>
                    <img className="h-5" src="./src/assets/ui_components/right-arrow.png" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomBotPanel;
