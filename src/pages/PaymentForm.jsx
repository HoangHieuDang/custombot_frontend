import { useEffect, useState } from "react";
import Orders from "../api/ordersApi";
import { useNavigate } from "react-router-dom";

export default function PaymentForm({ userId }) {
  const [ordersToPay, setOrdersToPay] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingOrders = async () => {
      const api = new Orders();
      const res = await api.getOrder({ user_id: userId, status: "pending" });
      if (res.ok) {
        const data = await res.json();
        setOrdersToPay(data);
      }
    };
    if (userId) fetchPendingOrders();
  }, [userId]);

  const handlePayment = async () => {
    const api = new Orders();

    for (let order of ordersToPay) {
      await api.updateOrder(order.id, {
        status: "paid",
        payment_method: paymentMethod,
        shipping_address: address,
        shipping_date: new Date().toISOString().slice(0, 10),
      });
    }

    alert("Payment successful!");
    navigate("/orders");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-light mb-4">Enter Payment Details</h1>

      <label className="block mb-2 text-sm">Shipping Address:</label>
      <textarea
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full px-3 py-2 rounded text-black"
        required
      />

      <label className="block mt-4 mb-2 text-sm">Payment Method:</label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full px-3 py-2 rounded text-black"
      >
        <option value="credit_card">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="bank_transfer">Bank Transfer</option>
      </select>

      <button
        onClick={handlePayment}
        className="mt-6 bg-orange-400 px-6 py-2 rounded hover:bg-orange-500"
      >
        Pay Now
      </button>
    </div>
  );
}
