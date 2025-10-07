import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./Pages/NavBar";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <div className="main relative">
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
