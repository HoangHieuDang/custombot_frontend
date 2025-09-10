import { useEffect, useState } from "react";
import Preview3dWindow from "../components/Preview3dWindow";
import Orders from "../api/ordersApi";
import Bots from "../api/customBotsApi";
import { useNavigate } from "react-router-dom";
import OrderPartsList from "../components/OrderPartsList";

export default function Cart({ userId, setIsOrderOpen }) {
  const navigate = useNavigate();
  const [cartOrders, setCartOrders] = useState([]);
  const [customBotMap, setCustomBotMap] = useState({});
  const [isPaying, setIsPaying] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  // Step 1: Fetch pending orders
  // fetchCart get order infos and set CartOrders state
  const fetchCart = async () => {
    const api = new Orders();
    const data = await api.getOrder({ user_id: userId, status: "pending" });
    if (data && Array.isArray(data)) {
      setCartOrders(data);
    } else {
      setCartOrders([]);
    }
  };

  useEffect(() => {
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
      setIsOrderOpen(true);
    } else {
      setIsOrderOpen(false);
    }
  }, [cartOrders]);

  //handle Payment
  const handlePayment = async () => {
    if (!shippingAddress.trim()) {
      alert("Please enter a shipping address before confirming payment.");
      return; // Stop the function if address is empty
    }

    const api = new Orders();
    for (let order of cartOrders) {
      await api.updateOrder({
        id: order.id,
        status: "paid",
        quantity: order.quantity,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        shipping_date: new Date().toISOString().slice(0, 10),
      });
    }

    setIsPaymentSuccess(true);
    setShowPaymentForm(false);
    // clear form and refresh cart
    setShippingAddress("");
    fetchCart(); // refresh from backend
  };

  //handling order quantity change
  const orderQuantityChange = (order_id, diff) => {
    setCartOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === order_id) {
          const newQuantity = order.quantity + diff;
          return {
            ...order,
            quantity: newQuantity > 0 ? newQuantity : 1, // prevent 0 or negative
          };
        }
        return order;
      })
    );
  };

  //calculating total Sum
  const orderTotalSum = () => {
    return cartOrders
      .reduce((sum, order) => {
        const bot = customBotMap[order.custom_robot_id];
        const unitPrice = bot?.price || 0;
        return sum + unitPrice * order.quantity;
      }, 0)
      .toFixed(2);
  };

  const handleDeletePendingOrder = async (orderId) => {
    // The backend should automatically switch the status of custombot from "ordered" to "in_progress"
    // Only pending orders should be deletable
    // when the the pending order is deleted
    const api = new Orders();
    await api.deleteOrder(orderId);
    // refetch cart again to update the cart
    fetchCart();
  };

  return (
    <>
      <div className="flex flex-col lg:flex-col w-full h-screen p-6 gap-6 justify-center">
        <div className="text-white w-full">
          <h1 className="text-3xl font-light mb-4 mr-5 ml-5 text-center">
            Your Cart
          </h1>
          {cartOrders.length === 0 ? (
            !isPaymentSuccess && (
              <div className="flex flex-col justify-center pt-10 pb-10 pl-5 pr-5 rounded-2xl bg-gray-700 max-w-6/7 md:max-w-3/6 m-auto">
                <p className="text-center text-amber-100 mb-5 font-extralight">
                  Your cart is empty
                </p>
                <div className="w-max-5/8 ml-auto mr-auto">
                  <button
                    className="w-full self-center p-1 mb-5 bg-gray-800 text-white font-extralight rounded hover:bg-gray-600 hover:text-amber-400 cursor-pointer"
                    onClick={() => {
                      navigate("/order");
                    }}
                  >
                    Track your orders
                  </button>
                  <button
                    className="w-full self-center p-1 mb-2 bg-gray-800 text-white font-extralight rounded hover:bg-gray-600 hover:text-amber-400 cursor-pointer"
                    onClick={() => {
                      navigate("/custombot");
                    }}
                  >
                    Customize another bot
                  </button>
                </div>
              </div>
            )
          ) : (
            <div
              className={`transition-all duration-500 w-full bg-gray-700 rounded-3xl p-4 overflow-y-auto ml-auto mr-auto hover:border-1 hover:border-amber-200 ${
                showPaymentForm
                  ? "max-h-40 ml-5 mr-5 pr-3 max-w-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-300 [&::-webkit-scrollbar-thumb]:rounded-full"
                  : "max-h-9/10"
              }`}
            >
              {cartOrders.map((order) => {
                const bot = customBotMap[order.custom_robot_id];

                return bot ? (
                  <div
                    key={order.id}
                    onClick={() => {
                      setExpandedOrderId(
                        expandedOrderId === order.id ? null : order.id
                      );
                    }}
                    className="bg-gray-800 p-4 rounded-xl mb-3 hover:bg-gray-600 cursor-pointer"
                  >
                    <div>
                      <div className="w-full grid grid-cols-2 grid-rows-2 items-center md:grid-cols-3 md:grid-rows-1">
                        <p className="col-start-1 row-start-1 text-lg font-semibold justify-self-start">
                          {bot.name}
                        </p>
                        <div className="col-span-2 row-start-2 flex flex-row gap-2 justify-self-start items-center pt-3 pb-3 md:col-start-2 md:row-start-1 md:col-span-1 md:justify-self-center">
                          <img
                            onClick={(e) => {
                              e.stopPropagation();
                              orderQuantityChange(order.id, -1);
                            }}
                            className="cursor-pointer hover:brightness-75 justify-self-end h-6 w-6"
                            src="./assets/ui_components/minus_quant.png"
                            alt="minus-icon"
                          />
                          <p className="text-sm text-gray-400 p-1 text-center">
                            Quantity: {order.quantity}
                          </p>
                          <img
                            onClick={(e) => {
                              e.stopPropagation();
                              orderQuantityChange(order.id, 1);
                            }}
                            className="cursor-pointer hover:brightness-75 justify-self-start h-6 w-6"
                            src="./assets/ui_components/add_quant.png"
                            alt="minus-icon"
                          />
                        </div>
                        <p className="col-start-2 row-start-1 font-light justify-self-end md:col-start-3 md:row-start-1">
                          Price: {order.total_price}
                        </p>
                      </div>
                      <div
                        className={`mt-4 grid md:grid-cols-3 md:items-start ${
                          expandedOrderId === order.id
                            ? "grid-cols-1 gap-2"
                            : "grid-cols-2 grid-rows-1"
                        }`}
                      >
                        {/* Parts + Preview */}
                        <div className="md:col-span-2">
                          {expandedOrderId === order.id ? (
                            <div className="grid grid-cols-1 grid-rows-2 gap-2 md:grid-cols-2 md:grid-rows-1">
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="h-50 w-full overflow-auto rounded-2xl bg-gray-900 text-white border md:h-60"
                              >
                                <OrderPartsList order={order} />
                              </div>
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="h-50 w-full rounded-2xl overflow-hidden shadow-lg md:h-60"
                              >
                                <Preview3dWindow
                                  botId={order.custom_robot_id}
                                />
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs font-extralight text-amber-100">
                              <span className="block sm:hidden">
                                Tap to preview
                              </span>
                              <span className="hidden sm:block">
                                Tap to preview your design
                              </span>
                            </p>
                          )}
                        </div>

                        {/* Trash icon */}
                        <div className="h-full mt-4 md:flex justify-end items-end md:col-span-1 md:mt-0">
                          <img
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePendingOrder(order.id);
                            }}
                            className="h-6 w-6 justify-self-end cursor-pointer hover:brightness-75 hover:h-7 hover:w-7"
                            src="./assets/ui_components/trash_can.png"
                            alt="delete-icon"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
              <div className="mt-6 grid grid-cols-2 items-center justify-center">
                {showPaymentForm ? null : (
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full bg-green-500 px-6 py-2 rounded hover:bg-green-600 justify-self-start md:w-1/2"
                  >
                    purchase
                  </button>
                )}
                <p className="justify-self-end font-bold text-amber-200">
                  Total: {orderTotalSum()}
                </p>
              </div>
            </div>
          )}
        </div>

        {showPaymentForm && (
          <div className="w-auto flex-1 bg-gray-700 p-4 rounded-xl text-white max-h-[90vh] justify-center">
            <h2 className="text-xl mb-4">Payment Details</h2>
            <label className="block text-sm mb-1">Shipping Address:</label>
            <textarea
              className="transition-all duration-100 w-full p-2 rounded text-white mb-4 border-amber-50 border-1 hover:border-amber-400"
              rows="3"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />

            <label className="block text-sm mb-1">Payment Method:</label>
            <select
              className="transition-all duration-100 w-full p-2 rounded text-white mb-4 border-amber-50 border-1 hover:border-amber-400"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>

            <button
              onClick={handlePayment}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Confirm Payment
            </button>
          </div>
        )}

        {isPaymentSuccess ? (
          <div className="w-auto flex flex-col bg-gray-700 p-4 rounded-xl text-white max-h-[90vh] justify-center">
            <h2 className="text-xl mb-4 text-center font-extralight text-green-400">
              Payment Successful!
            </h2>
            <p className="p-3 text-center font-extralight text-green-100">
              Thank you for your purchase!
            </p>
            <button
              className="self-center w-3/5 md:w-1/5 p-3 m-2 bg-gray-800 text-white font-extralight px-4 py-2 rounded hover:bg-gray-600 hover:text-amber-400 cursor-pointer"
              onClick={() => {
                navigate("/order");
              }}
            >
              Track your orders
            </button>
            <button
              className="self-center w-3/5 md:w-1/5 p-3 m-2 bg-gray-800 text-white font-extralight px-4 py-2 rounded hover:bg-gray-600 hover:text-amber-400 cursor-pointer"
              onClick={() => {
                navigate("/custombot");
              }}
            >
              Customize another bot
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
