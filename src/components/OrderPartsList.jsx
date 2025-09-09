import React from "react";
import Bots from "../api/customBotsApi";
import { useState } from "react";
import { useEffect } from "react";
const OrderPartsList = ({ order }) => {
  const [partsList, setPartsList] = useState([]);
  const fetchParts = async () => {
    if (!order) {
      console.warn("order not given!");
      return;
    }
    const botApi = new Bots();
    const data = await botApi.getPartsFromCustomBot(order.custom_robot_id);
    console.log("data from getPartsFromCustomBot:", data);
    setPartsList(data);
  };
  useEffect(() => {
    fetchParts();
  }, [order]);
  return (
    <>
      {order ? (
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-gray-800">
            <tr>
              <th className="border px-2 py-1 text-left">#</th>
              <th className="border px-2 py-1 text-left">Part name</th>
              <th className="border px-2 py-1 text-left">Part type</th>
              <th className="border px-2 py-1 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {partsList.map((part, index) => (
              <tr key={index} className="odd:bg-gray-800 even:bg-gray-700">
                <td className="border px-2 py-1">{index + 1}</td>
                <td className="border px-2 py-1 whitespace-nowrap">
                  {part.robot_part_name}
                </td>
                <td className="border px-2 py-1">{part.type}</td>
                <td className="border px-2 py-1">{part.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="p-2">No order was given</p>
      )}
    </>
  );
};

export default OrderPartsList;
