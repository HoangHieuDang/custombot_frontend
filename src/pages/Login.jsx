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
      //add a small delay
      await new Promise((resolve) => setTimeout(resolve, 100));
      const res = await httpClient.get("/users/@me");
      console.log("res", res);
      setUser(res.data);
      navigate("/custombot");
    } catch (err) {
      alert("Login failed.");
      console.warn("Can not login: ", err);
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center #222222">
      {/* image-banner-for-background */}
      <img
        className="absolute w-auto h-9/10 z-5 left-auto right-auto pointer-events-none brightness-30 hidden md:block"
        src="./assets/images/Custombot_Banner_Transparent.png"
        alt="a banner picture of custom bots"
      />
      {/* image-banner-for-background */}
      <img
        className="absolute w-auto h-9/10 z-5 left-auto right-auto pointer-events-none brightness-30 md:hidden"
        src="./assets/images/Custombot_Banner_Transparent_mobile.png"
        alt="a banner picture of custom bots"
      />
      <div className="absolute marquee-wrapper h-1/1 w-1/1 z-3 flex flex-row items-center justify-evenly">
        <p className="z-0 text-9xl text-amber-100 font-extralight  marquee-content-right">
          Custom your own robot
        </p>
        <p className="z-0 text-6xl text-amber-50 font-extralight  marquee-content-left">
          Combine the parts yourself
        </p>
        <p className="z-0 text-4xl text-amber-200 font-extralight  marquee-content-right">
          Make your dream robot come true
        </p>
        <p className="z-0 text-8xl text-amber-50 font-extralight  marquee-content-right">
          It is never too late to have fun
        </p>
      </div>
      <div className="ml-auto mr-auto w-9/12 md:w-6/12 p-4 z-10 bg-gray-700 flex flex-col items-center justify-center rounded-2xl">
        <h1 className="text-2xl font-extralight mb-4 text-amber-300">Login</h1>
        <input
          className="border p-2 mb-2 w-full md:w-3/10"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 mb-2 w-full md:w-3/10"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white text-sm font-extralight px-4 py-2 w-3/10 mb-4 rounded cursor-pointer border-1 border-blue-500 hover:border-amber-200"
          onClick={loginUser}
        >
          Log in
        </button>

        <div className="text-center text-sm text-gray-400">
          Not a user yet?{" "}
          <button
            className="text-blue-500 underline"
            onClick={() => navigate("/register")}
          >
            Register here
          </button>
        </div>
      </div>
    </section>
  );
}

export default Login;
