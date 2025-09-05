import React from "react";
import CustomBotPanel from "./CustomBotPanel";
import { useState, useRef } from "react";
import Bots from "../api/customBotsApi";

const CustomBotList = ({ userId, customBots, refetchCustomBots }) => {
  //customBots is an [{...},{...},{...},...]
  const [selectedBot, setSelectedBot] = useState(null);
  //useRef Imperative to call the save Custom bot functions from child CustomBotPanel
  const saveBotRef = useRef(null);
  const handleChosenBot = async (bot) => {
    // if a bot is already open, save before switching
    if (saveBotRef.current && selectedBot && selectedBot.id !== bot.id) {
      await saveBotRef.current.saveBot();
    }
    setSelectedBot(bot);
  };

  //Handling Create new Bot
  const createNewBot = async (bot = null) => {
    const botApi = new Bots();
    let baseName = bot ? bot.name : "new_custom_bot";
    let newBotName = baseName;
    const botNameList = customBots.map((bot) => bot.name); // Extract names

    // Generate a unique name
    let namingIndex = 1;
    while (botNameList.includes(newBotName)) {
      newBotName = `${baseName}${namingIndex}`;
      namingIndex++;
    }

    try {
      // Send request to create the bot
      const result = await botApi.createCustomBot({
        user_id: userId,
        name: newBotName,
      });

      // Handle structured response tuple of 2 elements (success(boolean), message(string))
      if (result?.success && bot) {
        //fetch all parts of the to-be-duplicated bot
        const duplicatedBotParts = await botApi.getPartsFromCustomBot(bot.id);
        //get the id of the newly created bot
        //if duplicated bot has parts, update the parts to the new duplicated bot
        if (
          result.ids.length === 1 &&
          duplicatedBotParts &&
          Object.keys(duplicatedBotParts).length > 0
        ) {
          for (const part of duplicatedBotParts) {
            await botApi.addPartToBot({
              part_id: part.robot_part_id,
              custom_robot_id: result.ids[0],
              amount: part.amount,
              direction: part.direction,
            });
          }
        }
        //refresh the bot list here - refetchCustomBots is a props function from parent CustomBot to trigger fetching custom bots
      } else {
        console.warn(
          `Failed to duplicate bot: ${result?.message || "Unknown error"}`
        );
      }
      if (result?.success && !bot) {
        console.log(`New bot created: ${result.message}`);
        //refresh the bot list here - refetchCustomBots is a props function from parent CustomBot to trigger fetching custom bots
      } else {
        console.warn(
          `Failed to create bot: ${result?.message || "Unknown error"}`
        );
      }
      refetchCustomBots();
    } catch (err) {
      console.error("Unexpected error while creating bot:", err);
      refetchCustomBots();
    }
  };

  //Handling Duplicate Bot
  //set selected bot to null when bot is deleted in CustomBotPanel Component
  const handleBotDeleted = () => {
    setSelectedBot(null);
  };

  return (
    <>
      <div className="h-1/1 w-screen">
        <h1 className="text-4xl font-extralight p-3 text-center">
          Custombot lists
        </h1>
        <div
          className={`transition-all duration-500 animate-fade-in-scale w-12/13 bg-gray-700 rounded-3xl p-4 overflow-y-auto ml-auto mr-auto hover:border-1 hover:border-amber-200 ${
            selectedBot
              ? "max-h-40 ml-5 mr-5 pr-3 max-w-10/12 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-300 [&::-webkit-scrollbar-thumb]:rounded-full"
              : "max-h-9/10"
          }`}
        >
          {customBots.length === 0 ? (
            <p className="ml-auto mr-auto">no current custombot</p>
          ) : (
            customBots.map((bot) => (
              <div
                onClick={() => handleChosenBot(bot)}
                key={`div_bot_list_${bot.name}`}
                className="transition-all duration-700 bg-gray-600 rounded-2xl m-2 grid  gap-2 font-extralight hover:bg-gray-400 cursor-pointer grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1"
              >
                <p className="m-2 text-amber-300 font-semibold">{`${bot.name}`}</p>

                <p className="m-2 justify-self-start md:justify-self-end">
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

                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    createNewBot(bot);
                  }}
                  className="border-1 rounded-2xl m-1 transition-all duration-200 flex flex-row gap-2 justify-self-end cursor-pointer p-2 hover:text-amber-500 hover:font-bold hover:underline md:border-0"
                >
                  {bot.status === "ordered"
                    ? "duplicate to re-edit"
                    : "duplicate"}
                </span>
              </div>
            ))
          )}
          <button
            className="transition-all duration-200 ml-auto mr-auto flex flex-row gap-2 cursor-pointer p-3 rounded-2xl hover:bg-gray-600 hover:text-amber-500 hover:border-1 hover:border-amber-500 hover:font-bold"
            onClick={() => createNewBot()}
          >
            <img
              className="w-6 h-6"
              src="./assets/ui_components/add.png"
              alt="add_ui_icon"
            />
            <p>Create new bot</p>
          </button>
        </div>

        {selectedBot ? (
          <CustomBotPanel
            ref={saveBotRef}
            userId={userId}
            selectedBot={selectedBot}
            refetchCustomBots={refetchCustomBots}
            onBotDeleted={handleBotDeleted}
          />
        ) : null}
      </div>
    </>
  );
};

export default CustomBotList;
