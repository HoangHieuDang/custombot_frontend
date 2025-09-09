import React, { useState, useEffect } from "react";
import Users from "../api/usersApi";

const Profile = ({ user, fetchUser }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUserUpdateSuccess, setIsUserUpdateSuccess] = useState(false);
// When the user prop changes, set email and username again
  useEffect(() => {
    setEmail(user.email);
    setUserName(user.username);
  }, [user]);

  //when user is typing sth to change sth, set the isUserUpdateSuccess back to false to reset the save changes state
  useEffect(() => {
    const hasChanged =
      userName !== user.username || email !== user.email || password !== "";
    if (hasChanged) {
      setIsUserUpdateSuccess(false);
    }
  }, [userName, email, password, user]);

  const saveUser = async () => {
    const userApi = new Users();
    const updateRes = await userApi.updateUser({
      id: user.id,
      username: userName,
      email: email,
      password: password,
    });

    if (updateRes.success) {
      setIsUserUpdateSuccess(true);
      setPassword(""); // clear password field for security
      console.log(updateRes.message);
      if (fetchUser) fetchUser();
    } else {
      setIsUserUpdateSuccess(false);
      console.warn(updateRes.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-4xl font-extralight mb-6">Your Profile</h1>

      {/* Profile Information */}
      {user ? (
        <div className="bg-gray-700 rounded-xl p-6 mb-8 shadow-lg">
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

      {/* Edit Username, Email and Password */}
      <div className="bg-gray-700 rounded-xl p-6 mb-8 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Credentials</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">User Name</label>
            <input
              type="username"
              className="w-full p-2 bg-gray-600 rounded-md border border-gray-500"
              value={userName || ""}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Update your username"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 bg-gray-600 rounded-md border border-gray-500"
              value={email || ""}
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
              className="w-full p-2 bg-gray-600 rounded-md border border-gray-500"
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <button
            className={`mt-4 px-4 py-2  hover:bg-blue-700 rounded-md cursor-pointer ${
              isUserUpdateSuccess ? "animate-bg-green" : " bg-blue-600"
            } `}
            onClick={saveUser}
          >
            {isUserUpdateSuccess ? "Changes saved" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
