import React from "react";
import CustomBotList from "../components/CustomBotList";
import { useState } from "react";
import { useEffect } from "react";
import Bots from "../api/customBotsApi";

const CustomBot = () => {
  //Hardcoded customBots for testing
  const customBotsHardCoded = [
    { name: "oberlisk", status: "in progress", id: 1 },
    { name: "zilius", status: "ordered", id: 2 },
  ];
  //create useState UserID to know which user is currently chosen
  const [userId, setUserId] = useState(null);
  const [customBots, setCustomBots] = useState([]);
  {
    /* customBots is a list of custombots objects
    example: customBots: [{name: "obelisk",...}, {name:"Gundam",...}
    */
  }
//fetch customBot data based on customBot id, also usable for user_id
  useEffect(() => {
    const fetchParts = async () => {
      const apiBots = new Bots();
      const bots = await apiBots.getCustomBot({user_id:2});
      if (bots){
        setCustomBots(bots)
      }
    };
    fetchParts();
  }, []);
  return (
    <>
      <CustomBotList customBots={customBots} />
    </>
  );
};

export default CustomBot;
