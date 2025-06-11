import React from "react";
import CustomBotPanel from "./CustomBotPanel";
import { useState } from "react";
import Bots from "../api/customBotsApi";

const CustomBotList = ({ userId, customBots }) => {
  const [selectedBot, setSelectedBot] = useState(null);

  const handleChosenBot = (bot) => {
    setSelectedBot(bot);
    return bot;
  };

  //Handling Create new Bot
  const createNewBot = async () => {
    const botApi = new Bots();
    const baseName = "new_custom_bot";
    let newBotName = baseName;
    const botNameList = [];

    // Collect existing bot names
    if (customBots) {
      for (const [customBotName] of Object.entries(customBots)) {
        botNameList.push(customBotName);
      }
    }
    console.log("botNameList:",botNameList)
    // Find a unique name by appending index
    let namingIndex = 1;
    while (botNameList.includes(newBotName)) {
      newBotName = `${baseName}${namingIndex}`;
      namingIndex++;
    }

    try {
      // Use the updated API wrapper method
      const { success, message } = await botApi.createCustomBot({
        user_id: userId,
        name: newBotName,
      });

      if (success) {
        console.log(`Bot created: ${message}`);
        // Optionally refresh bot list here if needed
      } else {
        console.warn(`Failed to create bot: ${message}`);
      }
    } catch (err) {
      console.error("Unexpected error while creating bot:", err);
    }
  };

  return (
    <>
      <div className="h-1/1 w-screen">
        <h1 className="text-4xl font-extralight p-3 text-center">
          Custombot lists
        </h1>
        <div
          className={`transition-all duration-300 w-full bg-gray-700 rounded-3xl p-4 overflow-y-auto ${
            selectedBot
              ? "max-h-40 ml-5 mr-5 pr-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:mr-5 [&::-webkit-scrollbar-thumb]:bg-orange-300 [&::-webkit-scrollbar-thumb]:rounded-full"
              : "max-h-[600px]"
          }`}
        >
          {customBots.length === 0 ? (
            <p className="ml-auto mr-auto">no current custombot</p>
          ) : (
            customBots.map((bot) => (
              <div
                onClick={() => handleChosenBot(bot)}
                key={`div_bot_list_${bot.name}`}
                className="bg-gray-600 rounded-2xl m-2 grid grid-cols-3 gap-2 font-extralight hover:bg-gray-400 cursor-pointer"
              >
                <p className="m-2">{`${bot.name}`}</p>
                <p className="m-2 justify-self-start">
                  status:{" "}
                  <strong
                    className={
                      bot.status === "ordered"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }
                  >
                    {bot.status}
                  </strong>
                </p>
                {bot.status === "in_progress" ? (
                  <img
                    className="w-6 h-6 justify-self-end mr-2 mt-auto mb-auto"
                    src="./src/assets/images/trolley.png"
                    alt="trolley_icon"
                  />
                ) : null}
              </div>
            ))
          )}
          <button
            className="ml-auto mr-auto flex flex-row gap-2 cursor-pointer p-3 rounded-2xl hover:bg-gray-600 hover:text-amber-500 hover:font-bold"
            onClick={()=>createNewBot()}
          >
            <img
              className="w-6 h-6"
              src="./src/assets/ui_components/add.png"
              alt="add_ui_icon"
            />
            <p>Create new bot</p>
          </button>
        </div>
        {selectedBot ? <CustomBotPanel selectedBot={selectedBot} /> : null}
      </div>
    </>
  );
};

export default CustomBotList;
