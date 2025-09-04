import React, { useEffect, useState } from "react";
import Bots from "../api/customBotsApi";
import Parts from "../api/partsApi";
import { DynamicPart } from "./DynamicPart";
import { basePath } from "../api/general_config";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

const Preview3dWindow = ({ currentParts, botId }) => {
  {
    /* 
        //currentParts has to have the following structure:
        // currentParts = {
        //   head: { index: 0, direction: 'center', partId: 2, modelUrl: 'cb_head_1.gltf' },
        //   upper_arm: [
        //     { index: 1, direction: 'left', partId: 1, modelUrl: 'cb_arm_left.gltf' },
        //     { index: 2, direction: 'right', partId: 3, modelUrl: 'cb_arm_right.gltf' }
        //   ]} 
    */
  }
  const [isLoading, setIsLoading] = useState(false);
  const [parts, setParts] = useState(currentParts || {});
  useEffect(() => {
    //if currentParts exists and botId does not exist, set parts as currentParts
    if (currentParts && Object.keys(currentParts).length > 0 && !botId) {
      setParts(currentParts);
    }
    //if botId exists, fetch the parts of the bot and set the fetched parts as parts and ignore currentParts
    if (botId) {
      fetchCurrentBot();
    }
  }, [botId, currentParts]);

  const fetchCurrentBot = async () => {
    setIsLoading(true);
    const botApi = new Bots();
    const botParts = await botApi.getPartsFromCustomBot(botId);
    const currentPartsObj = {};
    // Clear previous bot's parts before injecting new ones
    setParts({});
    if (Array.isArray(botParts) && botParts.length > 0) {
      // Bot has parts → build currentPartsObj
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
      }
    } else {
      // Bot has no parts → clear currentParts
      setParts({});
    }
    setParts(currentPartsObj);
    setIsLoading(false);
  };

  return isLoading ? (
    <BeatLoader
      color={"#ffdd80"}
      loading={isLoading}
      size={15}
      cssOverride={{ marginBottom: "5px" }}
    />
  ) : (
    <Canvas
      style={{ backgroundColor: "#BE5B55" }}
      camera={{ position: [0, 0, 15], fov: 100 }}
    >
      <ambientLight intensity={5} />
      <directionalLight position={[1, 2, 5]} intensity={5} />
      <OrbitControls />
      {Object.keys(parts).length > 0 ? (
        <Suspense fallback={null}>
          {Object.entries(parts).map(([type, entry]) => {
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
      ) : (
        <Text
          position={[0, 0, 0]} // Position in 3D space (x, y, z)
          fontSize={2} // Size of the text
          color="white" // Text color
          anchorX="center" // Horizontal alignment
          anchorY="middle" // Vertical alignment
        >
          Can not load 3d Parts
        </Text>
      )}
    </Canvas>
  );
};

export default Preview3dWindow;
