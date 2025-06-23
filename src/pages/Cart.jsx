import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Orders from "../api/ordersApi";

export default function Cart({ userId }) {
  const [cartOrders, setCartOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const api = new Orders();
      const res = await api.getOrder({ user_id: userId, status: "pending" });
      if (res.ok) {
        const data = await res.json();
        setCartOrders(data);
      }
    };
    if (userId) fetchCart();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-light mb-4">Your Cart</h1>
      {cartOrders.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-800 p-4 rounded-xl mb-3 flex justify-between items-center"
            >
              <div>
                <p className="text-lg">Bot ID: {order.custom_robot_id}</p>
                <p className="text-sm text-gray-400">Quantity: {order.quantity}</p>
              </div>
              {/* optional remove later */}
              {/* <button className="text-red-400">Remove</button> */}
            </div>
          ))}
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
