import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import CustomBot from "./pages/CustomBot";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Order from "./pages/Order";
import Login from "./pages/Login";
import httpClient from "./api/httpClient";
import Register from "./pages/Register";
import { BASE_URL } from "./api/apiConnConfig";

function App() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false); // prevent flicker

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await httpClient.get(`${BASE_URL}/users/@me`);
        setUser(res.data);
      } catch (err) {
        console.warn(err);
        setUser(null);
      } finally {
        setLoaded(true);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  if (!loaded) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Header user={user} onLogout={() => setUser(null)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/custombot"
          element={
            user ? <CustomBot userId={user.id} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/profile"
          element={
            user ? <Profile userId={user.id} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/order"
          element={user ? <Order userId={user.id} /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
