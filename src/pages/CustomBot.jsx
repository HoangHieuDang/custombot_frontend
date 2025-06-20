import React from "react";
import CustomBotList from "../components/CustomBotList";
import { useState } from "react";
import { useEffect } from "react";
import Bots from "../api/customBotsApi";

const CustomBot = ({ userId }) => {
  //create useState UserID to know which user is currently chosen
  //const [userId, setUserId] = useState(null);
  const [customBots, setCustomBots] = useState([]);
  {
    /* customBots is a list of custombots objects
    example: customBots: [{name: "obelisk",...}, {name:"Gundam",...}
    */
  }
  //fetch customBot data based on customBot id, also usable for user_id

  const refetchCustomBots = async () => {
    const apiBots = new Bots();
    const bots = await apiBots.getCustomBot({ user_id: userId });
    if (bots) {
      setCustomBots(bots);
    }
  };

  // ⏱ Trigger it initially when userId is ready
  useEffect(() => {
    if (userId) {
      refetchCustomBots();
    }
  }, [userId]);

  return (
    <CustomBotList
      userId={userId}
      customBots={customBots}
      refetchCustomBots={refetchCustomBots}
    />
  );
};

export default CustomBot;
