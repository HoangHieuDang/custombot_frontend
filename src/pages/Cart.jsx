import { useEffect, useState } from "react";
import Orders from "../api/ordersApi";
import Bots from "../api/customBotsApi";

export default function Cart({ userId }) {
  const [cartOrders, setCartOrders] = useState([]);
  const [customBotMap, setCustomBotMap] = useState({});
  const [isPaying, setIsPaying] = useState(false);
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
    }else{
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

    alert("Payment successful!");
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

  return (
    <>
      <div className="flex flex-col lg:flex-col w-full h-screen p-6 gap-6 justify-center">
        <div className="text-white w-full">
          <h1 className="text-3xl font-light mb-4 mr-5 ml-5 text-center">Your Cart</h1>
          {cartOrders.length === 0 ? (
            <p className="text-center">Your cart is empty</p>
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
                    className="bg-gray-800 p-4 rounded-xl mb-3"
                  >
                    <div>
                      <div className="w-full grid grid-cols-2 items-center">
                        <p className="text-lg font-semibold justify-self-start">
                          {bot.name}
                        </p>
                        <p className="font-light justify-self-end">
                          Price: {order.total_price}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-row gap-5 justify-baseline items-center">
                        <img
                          onClick={() => {
                            orderQuantityChange(order.id, -1);
                          }}
                          className="h-4 w-4 cursor-pointer hover:brightness-75 justify-self-end"
                          src="./assets/ui_components/minus_quant.png"
                          alt="minus-icon"
                        />
                        <p className="text-sm text-gray-400">
                          Quantity: {order.quantity}
                        </p>
                        <img
                          onClick={() => {
                            orderQuantityChange(order.id, 1);
                          }}
                          className="h-4 w-4 cursor-pointer hover:brightness-75 justify-self-start"
                          src="./assets/ui_components/add_quant.png"
                          alt="minus-icon"
                        />
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
              <div className="mt-6 grid grid-cols-2 items-center justify-center">
                {showPaymentForm ? null : (
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="w-1/2 bg-green-500 px-6 py-2 rounded hover:bg-green-600 justify-self-start"
                  >
                    Proceed to Payment
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
      </div>
    </>
  );
}
