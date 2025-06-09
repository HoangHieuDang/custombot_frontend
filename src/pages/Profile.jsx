import React, { useState, useEffect } from "react";
import Users from "../api/usersApi";

const Profile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const userApi = new Users();
      try {
        const data = await userApi.getUser(userId);
        if (Array.isArray(data) && data.length > 0) {
          setUser(data[0]);
          setEmail(data[0].email);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    setUser(userId);
    fetchUser();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
       <h1 className="text-4xl font-extralight p-3">Your Profile</h1>

      {/* Profile Information */}
      {user ? (
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Basic Info</h2>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.created_at).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      {/* Edit Email and Password */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Credentials</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Update your email"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md">
            Save Changes
          </button>
        </div>
      </div>

      {/* Previous Orders */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Previous Orders</h2>
        <ul className="space-y-2">
          {/* Placeholder orders */}
          {orders.length === 0 ? (
            <li className="text-gray-400">No previous orders found.</li>
          ) : (
            orders.map((order, index) => (
              <li key={index} className="p-3 bg-gray-700 rounded-md">
                Order #{order.id} – {order.date}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
