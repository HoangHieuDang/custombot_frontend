import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BASE_URL } from "./api/apiConnConfig";
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
import About from "./pages/About";
import { SquareLoader } from "react-spinners";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  async function fetchUser() {
    setIsLoading(true);
    try {
      const res = await httpClient.get(`${BASE_URL}/users/@me`);
      setUser(res.data);
    } catch (err) {
      console.warn(err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <SquareLoader
          color={"#ffdd80"}
          loading={true}
          size={200}
          cssOverride={{
            display: "block",
            margin: "0 auto",
            opacity: "0.4",
          }}
        />
        <p className="text-amber-100 mt-4 text-xl font-light">
          Loading PLAplay...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header
          user={user}
          isOrderOpen={isOrderOpen}
          onLogout={() => setUser(null)}
        />
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
                )
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
            <Route path="/about" element={<About />} />
            <Route
              path="/cart"
              element={
                user ? (
                  <Cart userId={user.id} setIsOrderOpen={setIsOrderOpen} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
