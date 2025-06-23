import { useEffect, useState } from "react";
import Orders from "../api/ordersApi";


const OrderStatusStepper = ({ status }) => {
  //"pending", "paid", "shipped", "cancelled"
  const steps = ["Order Received", "In Production", "Shipping", "Arrived", "Received"];
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="flex flex-col gap-2 text-sm">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full border-2 ${
              index <= currentStepIndex ? "bg-orange-300 border-orange-400" : "bg-gray-200 border-gray-300"
            }`}
          ></div>
          <span className={index <= currentStepIndex ? "text-orange-400" : "text-gray-400"}>{step}</span>
        </div>
      ))}
    </div>
  );
};

const Order = ({ userId }) => {
  // Placeholder mock data
  const[ordersObj, setOrdersObj] = useState(null)

  // useEffect(()=>{
  //   const fetchOrder = async () => {
  //     const orderApi = new Orders()
  //     const orderApiRes = await orderApi.getOrder({user_id:userId})
  //     if (orderApiRes.ok){
  //       setOrdersObj(orderApiRes)

  //     }
  //   }
  //  if (userId){fetchOrder()}
    
  // },[userId])
 
  

  const ongoingOrders = [
    {
      orderId: "CB-00124",
      botName: "BlazeDrift",
      status: "In Production",
      orderDate: "2025-06-06",
    },
  ];

  const pastOrders = [
    {
      orderId: "CB-00098",
      botName: "Blitz Phantom",
      status: "Received",
      orderDate: "2025-05-14",
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-900">
      <h1 className="text-4xl font-light mb-6">Your Orders</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Ongoing Orders</h2>
        <div className="grid gap-6">
          {ongoingOrders.map((order) => (
            <div
              key={order.orderId}
              className="border rounded-2xl p-5 bg-gray-800 shadow-md"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <p className="text-lg font-medium">{order.botName}</p>
                  <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
                  <p className="text-sm text-gray-400">Date: {order.orderDate}</p>
                </div>
                <span className="text-xs text-orange-500 self-start bg-orange-100 px-3 py-1 rounded-full">
                  {order.status}
                </span>
              </div>
              <OrderStatusStepper status={order.status} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Past Orders</h2>
        <div className="grid gap-6">
          {pastOrders.map((order) => (
            <div
              key={order.orderId}
              className="border rounded-2xl p-5 bg-gray-500"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-medium">{order.botName}</p>
                  <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
                  <p className="text-sm text-gray-400">Date: {order.orderDate}</p>
                </div>
                <span className="text-xs text-green-600 self-start bg-green-100 px-3 py-1 rounded-full">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Order;

