import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Home from "./pages/Home";
import CustomBot from "./pages/CustomBot";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Order from "./pages/Order";
import Login from "./pages/Login";
import Users from "./api/usersApi";

function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null);
  const userId = 1;
  
  useEffect(() => {
    const fetchUser = async () => {
      const userApi = new Users()
      try {
        const data = await userApi.getUser(userId)
        if (Array.isArray(data) && data.length > 0) {
          setUser(data[0]);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  if(!token){

    setToken("fake token")
    return <Login setToken={setToken}/>
  }
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/custombot" element={<CustomBot userId={userId} />} />
          <Route path="/profile" element={<Profile userId={userId}/>} />
          <Route path="/order" element={<Order userId={userId}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
