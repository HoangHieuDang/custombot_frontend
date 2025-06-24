import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Orders from "../api/ordersApi";
import Bots from "../api/customBotsApi";

export default function Cart({ userId }) {
  const [cartOrders, setCartOrders] = useState([]);
  const [customBotMap, setCustomBotMap] = useState({});
  const navigate = useNavigate();

  // Step 1: Fetch pending orders
  useEffect(() => {
    const fetchCart = async () => {
      const api = new Orders();
      const data = await api.getOrder({ user_id: userId, status: "pending" });

      if (data && Array.isArray(data)) {
        setCartOrders(data);
      }
    };

    if (userId) fetchCart();
  }, [userId]);

  // Step 2: Fetch all unique custom bots based on the cart
  useEffect(() => {
    const fetchCustomBots = async () => {
      const apiBots = new Bots();
      const uniqueBotIds = [
        ...new Set(cartOrders.map((o) => o.custom_robot_id)),
      ];
      const botMap = {};
      for (let botId of uniqueBotIds) {
        const res = await apiBots.getCustomBot({ id: botId });
        if (res && res.length === 1) {
          botMap[botId] = res[0];
        }
      }
      setCustomBotMap(botMap);
    };
    if (cartOrders.length > 0) {
      fetchCustomBots();
    }
  }, [cartOrders]);

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-light mb-4">Your Cart</h1>
      {cartOrders.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartOrders.map((order) => {
            const bot = customBotMap[order.custom_robot_id];

            return bot ? (
              <div
                key={order.id}
                className="bg-gray-800 p-4 rounded-xl mb-3 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">{bot.name}</p>
                  <p className="text-sm text-gray-400">
                    Quantity: {order.quantity}
                  </p>
                </div>
              </div>
            ) : null;
          })}
          <button
            onClick={() => navigate("/payment")}
            className="mt-6 bg-green-500 px-6 py-2 rounded hover:bg-green-600"
          >
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  );
}
