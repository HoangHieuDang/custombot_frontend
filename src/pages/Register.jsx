import { useState } from "react";
import httpClient from "../api/httpClient";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/apiConnConfig";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      await httpClient.post("/users/register", {
        username,
        email,
        password,
      });
      alert("Registered successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed.", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Register</h1>
      <input className="block border p-2 mb-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input className="block border p-2 mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="block border p-2 mb-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-green-500 text-white px-4 py-2" onClick={registerUser}>
        Register
      </button>
    </div>
  );
}

export default Register;