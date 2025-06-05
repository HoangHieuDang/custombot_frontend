import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import CustomBot from "./pages/CustomBot";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Order from "./pages/Order";
import Login from "./pages/Login";

function App() {
  const [token, setToken] = useState(null)

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
          <Route path="/custombot" element={<CustomBot />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order" element={<Order/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
