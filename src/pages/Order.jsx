import { useEffect, useState, Fragment } from "react";
import Orders from "../api/ordersApi";
import Bots from "../api/customBotsApi";
import Preview3dWindow from "../components/Preview3dWindow";
import OrderPartsList from "../components/OrderPartsList";

const OrderStatusStepper = ({ status }) => {
  //"paid", "production", "shipping", "received"
  const steps = ["paid", "production", "shipping", "received"];
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="flex flex-col gap-0 min-w-0 text-sm mt-0 mb-auto md:gap-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`hidden md:w-3 md:h-3 md:rounded-full md:border-1 md:block ${
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
//OrderCard component to display each order
const OrderCard = ({
  order,
  setExpandedOrderId,
  expandedOrderId,
  customBotMap,
}) => {
  return (
    <div
      key={order.orderId}
      className="border rounded-2xl p-5 bg-gray-800 shadow-md hover:bg-gray-700 cursor-pointer"
      onClick={() =>
        setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
      }
    >
      <div className="flex justify-between mb-2">
        <div className="flex flex-col overflow-auto max-w-1/2">
          <p className="text-lg font-medium text-amber-200 mb-1">
            {customBotMap[order.custom_robot_id]?.name || "Can't load Bot Name"}
          </p>
          <p className="text-sm">
            <span className="text-amber-100">Order Date: </span>
            <span className="text-gray-100 font-extralight pl-1">
              {order.created_at}
            </span>
          </p>
          <p className="text-sm text-gray-100">
            <span className="text-amber-100">Order ID: </span>
            <span className="text-gray-100 font-extralight pl-1">
              {order.id}
            </span>
          </p>
          <p className="text-sm text-gray-100">
            <span className="text-amber-100">Quantity: </span>
            <span className="text-gray-100 font-extralight pl-1">
              {order.quantity}
            </span>
          </p>
          <p className="text-sm text-gray-100">
            <span className="text-amber-100">Total price: </span>
            <span className="text-gray-100 font-extralight pl-1">
              {order.total_price}
            </span>
          </p>
          <p className="text-sm text-gray-100">
            <span className="text-amber-100">Shipping Address: </span>
            <span className="text-gray-100 font-extralight pl-1">
              {order.shipping_address}
            </span>
          </p>
          <p className="text-sm text-gray-100">
            <span className="text-amber-100">Shipping Date: </span>
            <span className="text-gray-100 font-extralight pl-1">
              {order.shipping_date && order.status === "shipping"
                ? order.shipping_date
                : "N/A"}
            </span>
          </p>
        </div>
        <OrderStatusStepper status={order.status} />
      </div>

      {expandedOrderId === order.id ? (
        <div className="p-2 rounded-2xl grid grid-cols-1 grid-rows-2 gap-2 md:grid-cols-2 md:grid-rows-1 md:gap-2">
          <div className="h-50 w-full overflow-auto animate-fade-in-scale border-1 rounded-2xl bg-gray-900 text-white md:h-60 hover:border-1 hover:border-amber-200 ">
            <OrderPartsList order={order} />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="transition-all duration-500 h-50 w-full animate-fade-in-scale border-1 rounded-2xl overflow-hidden shadow-lg justify-self-end align-self-center md:h-60 hover:border-1 hover:border-amber-200"
          >
            <Preview3dWindow botId={order.custom_robot_id} />
          </div>
        </div>
      ) : (
        <p className="text-0.5 font-extralight animate-fade-in-color text-amber-100 justify-self-end self-end">
          <span className="block sm:hidden">Tap to preview</span>
          <span className="hidden sm:block">Tap to preview your design</span>
        </p>
      )}
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
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-4xl font-extralight mb-6">Your Orders</h1>

      <section className="mb-10 bg-gray-600 p-4 rounded-2xl">
        <h2 className="text-2xl font-extralight mb-4 text-center">
          Ongoing Orders
        </h2>
        <div className="grid gap-6">
          {ordersList && ordersList.length > 0 ? (
            ordersList
              .filter((order) => ongoingStatuses.includes(order.status))
              .map((order) => (
                <OrderCard
                  key={order.orderId}
                  order={order}
                  setExpandedOrderId={setExpandedOrderId}
                  expandedOrderId={expandedOrderId}
                  customBotMap={customBotMap}
                />
              ))
          ) : (
            <p>No ongoing orders</p>
          )}
        </div>
      </section>

      <section className="bg-gray-600 p-4 rounded-2xl">
        <h2 className="text-2xl font-extralight mb-4 text-center">
          Past Orders
        </h2>
        <div className="grid gap-6">
          {ordersList &&
          ordersList.filter((order) => pastStatuses.includes(order.status))
            .length > 0 ? (
            ordersList
              .filter((order) => pastStatuses.includes(order.status))
              .map((order) => (
                <OrderCard
                  key={order.orderId}
                  order={order}
                  setExpandedOrderId={setExpandedOrderId}
                  expandedOrderId={expandedOrderId}
                  customBotMap={customBotMap}
                />
              ))
          ) : (
            <p className="text-center font-extralight text-gray-400" >No past orders</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Order;
