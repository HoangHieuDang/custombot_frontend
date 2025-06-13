import { useState, useEffect, Suspense, Fragment } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DynamicPart } from "./DynamicPart";
import Parts from "../api/partsApi";
import Bots from "../api/customBotsApi";

const CustomBotPanel = ({ selectedBot, refetchCustomBots }) => {
  const basePath = "./src/assets/3d_assets/";
  const botId = selectedBot.id;
  const botStatus = selectedBot.status;
  // List of all possible robot part types
  const [possibleParts, setPossibleParts] = useState([]);
  // List of all asymmetrical parts like arms, shoulders,... which have left and right sides
  const [asymParts, setAsymParts] = useState([]);
  // States for editing the current customBot name
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(selectedBot.name);
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
  //isCustomBotSaved tells whether the custombot has been saved after changes have been done
  const [isCustomBotSaved, setIsCustomBotSaved] = useState(false);

  //first useEffect fetches bot parts everytime botId is changed
  useEffect(() => {
    // Fetch possibleParts and asymParts if missing
    if (!botId) return;

    // Step 1: Reset state before fetching new bot's data
    setCurrentParts({});
    setPartUrls({});

    const fetchPartTypesList = async () => {
      if (possibleParts.length === 0 || asymParts.length === 0) {
        const partsApi = new Parts();
        const typeSets = await partsApi.getPartTypeSets();
        if (typeSets) {
          setPossibleParts((prev) =>
            Array.from(new Set([...prev, ...typeSets.all_types]))
          );
          setAsymParts((prev) =>
            Array.from(new Set([...prev, ...typeSets.asymmetrical_types]))
          );
        }
      }
    };
    fetchPartTypesList();
  }, [botId]);

  //Second useEffect fetchCurrentBot when possibleParts and asymParts lists are available
  useEffect(() => {
    //only fetch currentBotParts when possibleParts list and asymmetrical Parts list are fetched
    const isReady = possibleParts.length > 0 && asymParts.length > 0;
    if (!isReady || !botId) return;
    //fetchCurrentBot is responsible for fetching current bot parts into currentParts and initiate partUrls
    //fetchCurrentBot also handles the case when current bot doesnt have all parts of all types

    const fetchCurrentBot = async () => {
      const botApi = new Bots();
      const partsApi = new Parts();
      const botParts = await botApi.getPartsFromCustomBot(botId);
      const currentPartsObj = {};
      const partUrlsObj = {};

      // Clear previous bot's parts before injecting new ones
      setPartUrls({});

      if (Array.isArray(botParts) && botParts.length > 0) {
        // Bot has parts → build currentParts and preload partUrls
        for (const part of botParts) {
          const { type, direction, model_path, robot_part_id } = part;

          // Handle symmetric/asymmetric directions
          if (["left", "right"].includes(direction)) {
            if (!currentPartsObj[type]) currentPartsObj[type] = [];
            currentPartsObj[type] = currentPartsObj[type].filter(
              (entry) => entry.direction !== direction
            );
            currentPartsObj[type].push({
              index: 0,
              direction,
              modelUrl: model_path,
              partId: robot_part_id,
            });
          } else {
            currentPartsObj[type] = {
              index: 0,
              direction,
              modelUrl: model_path,
              partId: robot_part_id,
            };
          }

          // Inject into partUrlsObj
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
        // Ensure both 'left' and 'right' entries exist for asymmetrical parts
        for (const partType of asymParts) {
          if (Array.isArray(currentPartsObj[partType])) {
            const hasLeft = currentPartsObj[partType].some(
              (p) => p.direction === "left"
            );
            const hasRight = currentPartsObj[partType].some(
              (p) => p.direction === "right"
            );

            if (!hasLeft) {
              currentPartsObj[partType].push({
                index: 0,
                direction: "left",
                modelUrl: "",
                partId: null,
              });
            }
            if (!hasRight) {
              currentPartsObj[partType].push({
                index: 0,
                direction: "right",
                modelUrl: "",
                partId: null,
              });
            }
          }
        }
      } else {
        // If no parts, inject one fallback skeleton
        try {
          const res = await partsApi.getPart({
            part_type: "skeleton",
            page: 1,
            page_size: 1,
          });

          if (res?.results?.length > 0) {
            const skeleton = res.results[0];
            currentPartsObj["skeleton"] = {
              index: 0,
              direction: "center",
              modelUrl: skeleton.model_path,
              partId: skeleton.id,
            };
            partUrlsObj["skeleton"] = [
              {
                modelUrl: skeleton.model_path,
                partId: skeleton.id,
              },
            ];
          }
        } catch (err) {
          console.warn("Failed to fetch fallback skeleton part: ", err);
        }
      }

      // Inject missing part slots for all defined types
      for (const partType of possibleParts) {
        if (asymParts.includes(partType)) {
          if (!currentPartsObj[partType]) {
            currentPartsObj[partType] = [
              { index: 0, direction: "left", modelUrl: "", partId: null },
              { index: 0, direction: "right", modelUrl: "", partId: null },
            ];
          }
        } else if (!currentPartsObj[partType]) {
          currentPartsObj[partType] = {
            index: 0,
            direction: "center",
            modelUrl: "",
            partId: null,
          };
        }
      }

      setCurrentParts(currentPartsObj);
      setPartUrls(partUrlsObj); // Set new data after reset
    };

    if (botId) fetchCurrentBot();
  }, [botId, possibleParts, asymParts]);

  // third useEffect: Fetch more parts from database for each part type, excluding already used ones
  useEffect(() => {
    console.log("currentParts for third useEffect: ", currentParts);
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
    if (!urls || urls.length === 0) return;
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
      //set the state of isCustomBotSaved to false since changes have been made
      setIsCustomBotSaved(false);
      return updated;
    });
  };
  // Function for saving the currentParts into Backend Database

  const saveCustomBotParts = async () => {
    try {
      const botApi = new Bots();
      if (botStatus === "in_progress") {
        for (const [part, info] of Object.entries(currentParts)) {
          if (Array.isArray(info) && info.length > 0) {
            // For asymmetrical parts like left/right arms
            for (const asymPart of info) {
              await botApi.updatePartOnCustomBot({
                bot_id: botId,
                part_id: asymPart.partId,
                amount: 1,
                direction: asymPart.direction,
              });
            }
          } else if (info) {
            // For symmetrical/center parts
            await botApi.updatePartOnCustomBot({
              bot_id: botId,
              part_id: info.partId,
              amount: 1,
              direction: info.direction,
            });
          } else {
            console.log(`Nothing to update for part: ${part}`);
          }
        }
      }

      console.log("CustomBot successfully updated!");
      //set the isCustomBotSaved to true since saving in database
      setIsCustomBotSaved(true);
    } catch (err) {
      console.warn("Error while updating CustomBot:", err);
    }
  };

  const saveCustomBotName = async () => {
    const botApi = new Bots();
    try {
      const response = await botApi.updateCustomBot(selectedBot.id, {
        name: editedName,
      });

      if (response) {
        console.log("Name updated:", response);
        setIsEditingName(false);
        //refetch customBots to update the new name of bot on the bot list
        refetchCustomBots();
      }
    } catch (err) {
      console.error("Failed to update custom bot name:", err);
    }
  };

  const editNameHandling = () => {
    setIsEditingName(true);
    setEditedName(selectedBot.name)
  };
  //Everytime a new selectedBot is chosen from the CustomBotList
  //Certain things must happen for example: isCustomBotSaved must be set to false again.
  useEffect(() => {
    setIsCustomBotSaved(false);
    setEditedName(selectedBot.name);
  }, [selectedBot]);
  return (
    <>
      {/* Panel for settings options and customBot Name edit */}
      <div className="bg-gray-900 ml-auto mr-auto mt-5 rounded-t-2xl w-10/12">
        {botStatus === "in_progress" ? (
          <div className="flex flex-column items-center justify-center text-amber-50 font-extralight mb-5 ml-5">
            <button
              className={`rounded-2xl p-3 m-3 cursor-pointer hover:bg-gray-600 ${
                isCustomBotSaved ? "animate-bg-green" : "bg-gray-700"
              }`}
              onClick={() => saveCustomBotParts()}
            >
              {isCustomBotSaved ? "Saved" : "Save customization"}
            </button>
            <button className="rounded-2xl bg-gray-700 p-3 m-3 cursor-pointer hover:bg-gray-600">
              Order this bot
            </button>
          </div>
        ) : (
          <div className="flex flex-column items-center justify-center text-amber-50 font-extralight mb-5 ml-5">
            <h3 className="m-5">
              Custom Bot is ordered and cannot be edited anymore
            </h3>
          </div>
        )}
        <div className="flex flex-row items-center ml-auto mr-auto justify-center">
          {isEditingName ? (
            <Fragment>
              <label htmlFor="botname" className="mr-2 text-amber-200">
                Custombot:
              </label>
              <input
                type="text"
                name="botname"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-white m-4 p-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={saveCustomBotName}
                className="ml-2 mt-4 mb-4 p-1 rounded bg-gray-700 text-white font-extralight hover:bg-gray-600 cursor-pointer"
              >
                Save
              </button>
            </Fragment>
          ) : (
            <>
              <h2 className="text-center font-extralight m-4 text-amber-300 text-2xl">
                Custombot: {editedName}
              </h2>
              <button onClick={editNameHandling}>
                <img
                  src={"./src/assets/ui_components/edit.png"}
                  alt="edit-icon"
                  className="w-6 h-6 ml-2 hover:opacity-75"
                />
              </button>
            </>
          )}
        </div>

        <div className="flex gap-6 ml-5 mr-5 items-center justify-center">
          {/* 3D Canvas */}
          <div className="w-3/7 h-[700px] border rounded-md overflow-hidden mb-5">
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
                    return entry
                      .filter(
                        (e) =>
                          typeof e.modelUrl === "string" &&
                          e.modelUrl.endsWith(".gltf")
                      ) // <-- skip if empty only generate model with existing modelUrl and has .gltf format
                      .map(({ modelUrl, direction }, idx) => (
                        <DynamicPart
                          key={`${type}_${direction}_${idx}`}
                          url={`${basePath}${modelUrl}`}
                          direction={direction}
                          rotation={[0, Math.PI / 2, 0]}
                        />
                      ));
                  } else {
                    if (!entry.modelUrl) return null; // <-- skip if empty
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
          <div className="w-2/5 h-[700px] overflow-y-auto p-4 border rounded-md bg-gray-800 shadow-inner items-center text-white mb-5">
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
                        {botStatus === "in_progress" ? (
                          <button
                            onClick={() => switchPart(typeKey, -1, direction)}
                          >
                            <img
                              className="h-5"
                              src="./src/assets/ui_components/left-arrow.png"
                            />
                          </button>
                        ) : null}
                        <span className="flex-1 text-center text-xs truncate">
                          {modelUrl?.replace(".gltf", "") || "N/A"}
                        </span>
                        {botStatus === "in_progress" ? (
                          <button
                            onClick={() => switchPart(typeKey, 1, direction)}
                          >
                            <img
                              className="h-5"
                              src="./src/assets/ui_components/right-arrow.png"
                            />
                          </button>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-14">Option:</span>
                      {botStatus === "in_progress" ? (
                        <button onClick={() => switchPart(typeKey, -1)}>
                          <img
                            className="h-5"
                            src="./src/assets/ui_components/left-arrow.png"
                          />
                        </button>
                      ) : null}
                      <span className="flex-1 text-center text-xs truncate">
                        {partEntry.modelUrl?.replace(".gltf", "") || "N/A"}
                      </span>
                      {botStatus === "in_progress" ? (
                        <button onClick={() => switchPart(typeKey, 1)}>
                          <img
                            className="h-5"
                            src="./src/assets/ui_components/right-arrow.png"
                          />
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomBotPanel;
