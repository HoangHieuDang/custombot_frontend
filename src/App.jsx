import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import CustomBot from "./CustomBot";
import Profile from "./Profile";
import Layout from "./Layout";
import TestApi from "./TestApi";

function App() {

  return (
    <>
      <TestApi />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/custombot" element={<CustomBot />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
