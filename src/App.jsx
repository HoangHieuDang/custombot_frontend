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
import Cart from "./pages/Cart";
import PaymentForm from "./pages/PaymentForm";
import { BASE_URL } from "./api/apiConnConfig";

function App() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false); // prevent flicker

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

  useEffect(() => {
    fetchUser();
  }, []);

  if (!loaded) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      {/* without flex div there will be no awareness of screen height, components will not be arranged dynamically which can lead to unwanted overlapping*/}
      <div className="flex flex-col min-h-screen">
        <Header user={user} onLogout={() => setUser(null)} />
        {/* flex-grow allows the main component to stretch and fill in the blank space if there is still place on screen and push the footer element down */}
        <main className="flex-grow">
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
                user ? (
                  <Profile key={user.id} user={user} fetchUser={fetchUser} />
                ) : (
                  <Navigate to="/login" />
                ) //reassign user.id to key property everytime the user gets fetched again will force the component to re-render
              }
            />
            <Route
              path="/order"
              element={
                user ? <Order userId={user.id} /> : <Navigate to="/login" />
              }
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart userId={user.id} />} />
            <Route path="/payment" element={<PaymentForm userId={user.id} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
