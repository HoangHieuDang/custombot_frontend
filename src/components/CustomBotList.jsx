import React from "react";
import CustomBotPanel from "./CustomBotPanel";
import { useState } from "react";

const CustomBotList = ({ customBots }) => {
  const [selectedBot, setSelectedBot] = useState(null)
  
  const getBotById = (botId) => {
    setSelectedBot(botId)
    console.log("botId: ", botId)
  };
  return (
    <>
      <div className="h-1/1 w-screen">
        <h1 className="text-4xl font-extralight p-3">Your custombot lists</h1>
        <div className="h-1/1 w-2/3 ml-auto mr-auto p-2 rounded-3xl bg-gray-700">
          {customBots.length === 0 ? (
            <p className="ml-auto mr-auto">no current custombot</p>
          ) : (
            customBots.map((bot) => (
              <div
                onClick={() => getBotById(bot.id)}
                key={`div_bot_list_${bot.name}`}
                className="bg-gray-600 rounded-2xl m-2 grid grid-cols-3 gap-2 font-extralight hover:bg-gray-400 cursor-pointer"
              >
                <p className="m-2">{`Custombot: ${bot.name}`}</p>
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
          <button className="ml-auto mr-auto flex flex-row gap-2">
            <img
              className="w-6 h-6"
              src="./src/assets/ui_components/add.png"
              alt="add_ui_icon"
            />
            <p>Create new bot</p>
          </button>
        </div>
        {selectedBot?<CustomBotPanel botId={selectedBot} />:null}
      </div>


    </>
  );
};

export default CustomBotList;
