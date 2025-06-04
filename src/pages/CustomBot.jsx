import React from "react";
import CustomBotPanel from "../components/CustomBotPanel";
import CustomBotList from "../components/CustomBotList";
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
      <CustomBotList customBots={customBots}/>
      <CustomBotPanel />
    </>
  );
};

export default CustomBot;
