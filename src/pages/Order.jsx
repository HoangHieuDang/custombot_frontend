import { useEffect, useState, Fragment } from "react";
import Orders from "../api/ordersApi";
import Bots from "../api/customBotsApi";

const OrderStatusStepper = ({ status }) => {
  //"paid", "production", "shipping", "received"
  const steps = ["paid", "production", "shipping", "received"];
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="flex flex-col gap-2 text-sm">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full border-2 ${
              index <= currentStepIndex
                ? "bg-orange-300 border-orange-400"
                : "bg-gray-200 border-gray-300"
            }`}
          ></div>
          <span
            className={
              index <= currentStepIndex ? "text-orange-400" : "text-gray-400"
            }
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};
// Order main component
const Order = ({ userId }) => {
  const [ordersList, setOrdersList] = useState(null);
  const [customBotMap, setCustomBotMap] = useState({});

  const fetchOrder = async () => {
    const api = new Orders();
    const data = await api.getOrder({ user_id: userId });
    setOrdersList(Array.isArray(data) ? data : []);
  };
  //fetch all orders
  useEffect(() => {
    if (userId) fetchOrder();
  }, [userId]);

  //fetch custombot infos after ordersList is loaded
  useEffect(() => {
    const fetchCustomBots = async () => {
      const apiBots = new Bots();
      const uniqueBotIds = [...new Set(ordersList.map((o) => o.custom_robot_id))];
      const botMap = {};

      for (let botId of uniqueBotIds) {
        const res = await apiBots.getCustomBot({ id: botId });
        if (res && res.length === 1) {
          botMap[botId] = res[0];
        }
      }

      setCustomBotMap(botMap);
    };

    if (ordersList && ordersList.length > 0) {
      fetchCustomBots();
      console.log("customBotMap: ", customBotMap);
    }
  }, [ordersList]);

  const ongoingStatuses = ["paid", "production", "shipping"];
  const pastStatuses = ["received", "cancelled"];

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-900 text-white">
      <h1 className="text-4xl font-light mb-6">Your Orders</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Ongoing Orders</h2>
        <div className="grid gap-6">
          {ordersList && ordersList.length > 0 ? (
            ordersList
              .filter((order) => ongoingStatuses.includes(order.status))
              .map((order) => (
                <div
                  key={order.orderId}
                  className="border rounded-2xl p-5 bg-gray-800 shadow-md"
                >
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="text-lg font-medium">
                        {customBotMap[order.custom_robot_id]?.name ||
                          "Can't load Bot Name"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Order ID: {order.id}
                      </p>
                      <p className="text-sm text-gray-400">
                        Date: {order.created_at}
                      </p>
                    </div>
                    <span className="text-xs text-orange-500 self-start bg-orange-100 px-3 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <OrderStatusStepper status={order.status} />
                </div>
              ))
          ) : (
            <p>No ongoing orders</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Past Orders</h2>
        <div className="grid gap-6">
          {ordersList && ordersList.length > 0 ? (
            ordersList
              .filter((order) => pastStatuses.includes(order.status))
              .map((order) => (
                <div
                  key={order.orderId}
                  className="border rounded-2xl p-5 bg-gray-700"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-medium">
                        {customBotMap[order.custom_robot_id]?.name ||
                          "Can't load Bot Name"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Order ID: {order.id}
                      </p>
                      <p className="text-sm text-gray-400">
                        Date: {order.created_at}
                      </p>
                    </div>
                    <span className="text-xs text-green-600 self-start bg-green-100 px-3 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <p>No past orders</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Order;
