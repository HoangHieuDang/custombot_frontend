import { useState } from "react";
import httpClient from "../api/httpClient";
import { useNavigate } from "react-router-dom";


function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      await httpClient.post("/users/login", {
        email,
        password,
      });

      const res = await httpClient.get("/users/@me");
      console.log("res",res)
      setUser(res.data);
      navigate("/custombot");
    } catch (err) {
      alert("Login failed.");
      console.warn("Can not login: ", err)
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Login</h1>
      <input
        className="block border p-2 mb-2"
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="block border p-2 mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 w-full mb-4"
        onClick={loginUser}
      >
        Log in
      </button>

      <div className="text-center text-sm text-gray-600">
        Not a user yet?{" "}
        <button
          className="text-blue-500 underline"
          onClick={() => navigate("/register")}
        >
          Register here
        </button>
      </div>
    </div>
  );
}

export default Login;
