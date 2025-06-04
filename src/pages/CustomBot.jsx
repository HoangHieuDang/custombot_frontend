import React from "react";
import CustomBotPanel from "../components/CustomBotPanel";
import { useState } from "react";

const CustomBot = () => {
  const customBotsHardCoded = [
    { name: "oberlisk", status: "in progress" },
    { name: "zilius", status: "ordered" },
  ];
  const [customBots, setCustomBots] = useState(customBotsHardCoded);
  {
    /* customBots is a list of custombots objects
    example: customBots: [{name: "obelisk",...}, {name:"Gundam",...}
    */
  }
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
                key={`div_bot_list_${bot.name}`}
                className="bg-gray-600 rounded-bl-2xl rounded-tr-2xl m-2 grid grid-cols-3 gap-2 font-extralight"
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
                {bot.status === "in progress" ? (
                  <img
                    className="w-6 h-6 justify-self-end mr-2 mt-auto mb-auto"
                    src="./src/assets/images/trolley.png"
                    alt="trolley_icon"
                  />
                ) : null}
              </div>
            ))
          )}
          <button>Create new custom bot</button>
        </div>
      </div>
      {/*<CustomBotPanel /> */}
    </>
  );
};

export default CustomBot;
