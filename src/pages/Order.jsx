import { useEffect, useState, Fragment } from "react";
import Orders from "../api/ordersApi";
import Bots from "../api/customBotsApi";
import Preview3dWindow from "../components/Preview3dWindow";

const OrderStatusStepper = ({ status }) => {
  //"paid", "production", "shipping", "received"
  const steps = ["paid", "production", "shipping", "received"];
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="flex flex-col gap-2 text-sm mt-auto mb-auto">
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
  const [expandedOrderId, setExpandedOrderId] = useState(null);

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
      const uniqueBotIds = [
        ...new Set(ordersList.map((o) => o.custom_robot_id)),
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
                  className="border rounded-2xl p-5 bg-gray-800 shadow-md hover:bg-gray-700 cursor-pointer"
                  onClick={() =>
                    setExpandedOrderId(
                      expandedOrderId === order.id ? null : order.id
                    )
                  }
                >
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="text-lg font-medium">
                        {customBotMap[order.custom_robot_id]?.name ||
                          "Can't load Bot Name"}
                      </p>
                      <p className="text-sm text-gray-400">
                        Date: {order.created_at}
                      </p>
                      <p className="text-sm text-gray-500">
                        Order ID: {order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {order.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total price: {order.total_price}
                      </p>
                    </div>
                    <span className="text-xs text-orange-500 self-start bg-orange-100 px-3 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 grid-rows-1">
                    <OrderStatusStepper status={order.status} />
                    {expandedOrderId === order.id ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="transition-all duration-500 w-5/6 h-25 animate-fade-in-scale border-1 rounded-2xl overflow-hidden shadow-lg justify-self-end align-self-center md:w-4/5 h-60"
                      >
                        <Preview3dWindow botId={order.custom_robot_id} />
                      </div>
                    ) : (
                      <p className="text-0.5 font-extralight animate-fade-in-color text-amber-100 justify-self-end self-end">
                        <span className="block sm:hidden">Tap to preview</span>
                        <span className="hidden sm:block">
                          Tap to preview your design
                        </span>
                      </p>
                    )}
                  </div>
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
                  key={order.id}
                  className="border rounded-2xl p-5 bg-gray-800 shadow-md"
                >
                  {/* Header → only this toggles expand/collapse */}
                  <div
                    className="flex justify-between mb-2 cursor-pointer"
                    onClick={() =>
                      setExpandedOrderId(
                        expandedOrderId === order.id ? null : order.id
                      )
                    }
                  >
                    <div>
                      <p className="text-lg font-medium">
                        {customBotMap[order.custom_robot_id]?.name ||
                          "Can't load Bot Name"}
                      </p>
                      <p className="text-sm text-gray-400">
                        Date: {order.created_at}
                      </p>
                      <p className="text-sm text-gray-500">
                        Order ID: {order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {order.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total price: {order.total_price}
                      </p>
                    </div>
                    <span className="text-xs text-orange-500 self-start bg-orange-100 px-3 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>

                  {/* Content section */}
                  <div className="grid grid-cols-2 grid-rows-1">
                    <OrderStatusStepper status={order.status} />
                    {expandedOrderId === order.id ? (
                      <div className="transition-all duration-500 animate-fade-in-scale w-2/5 h-full rounded-2xl overflow-hidden justify-self-center self-center">
                        <Preview3dWindow botId={order.custom_robot_id} />
                      </div>
                    ) : (
                      <p className="font-extralight animate-brightness-in-out justify-self-end self-end">
                        <span className="block sm:hidden">Tap to preview</span>
                        <span className="hidden sm:block">
                          Tap to preview your design
                        </span>
                      </p>
                    )}
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
